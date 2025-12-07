//weights (you can tweak)
const WEIGHTS = {
  price: 0.4,
  completeness: 0.25,
  delivery: 0.15,
  warranty: 0.1,
  payment: 0.1,
};

function safeNumber(val, fallback = null) {
  if (val === null || val === undefined) return fallback;
  const num = Number(val);
  return Number.isFinite(num) ? num : fallback;
}

const buildProposalMetrics = (rfp, proposals) => {
  const rfpSpec = rfp.structuredSpec || {};
  const requiredDays = safeNumber(rfpSpec.deliveryDays, null);
  const requiredWarranty = safeNumber(rfpSpec.warrantyMonths, null);

  //extract base numeric metrics
  const base = proposals.map((p) => {
    const ex = p.extracted || {};
    const lineItems = Array.isArray(ex.lineItems) ? ex.lineItems : [];
    let totalAmount = safeNumber(ex.totalAmount, null);

    if (totalAmount === null && lineItems.length > 0) {
      const sum = lineItems
        .map((li) => safeNumber(li.totalPrice, 0))
        .reduce((a, b) => a + b, 0);
      totalAmount = sum > 0 ? sum : null;
    }

    const leadTimeDays = safeNumber(ex.leadTimeDays, null);
    const completeness = ex.completeness || {};
    const warrantyMonths =
      safeNumber(ex.warrantyMonths, null) ||
      safeNumber(lineItems[0]?.warrantyMonths, null);

    return {
      proposalId: p._id.toString(),
      vendorId: p.vendorId,
      vendorName: p.vendorName || "Unknown Vendor",
      currency: ex.currency || null,
      totalAmount,
      leadTimeDays,
      warrantyMonths,
      paymentTerms: ex.paymentTerms || null,
      completeness,
      rawExtracted: ex,
    };
  });

  const validPrices = base
    .map((b) => b.totalAmount)
    .filter((v) => typeof v === "number" && v > 0);
  const minPrice = validPrices.length ? Math.min(...validPrices) : null;

  const validLeads = base
    .map((b) => b.leadTimeDays)
    .filter((v) => typeof v === "number" && v > 0);
  const bestLead = validLeads.length ? Math.min(...validLeads) : null;

  const validWarranties = base
    .map((b) => b.warrantyMonths)
    .filter((v) => typeof v === "number" && v > 0);
  const maxWarranty = validWarranties.length ? Math.max(...validWarranties) : null;

  //compute scores
  const withScores = base.map((b) => {
    //price score: minPrice / thisPrice (lower is better)
    let priceScore = 0;
    if (minPrice && b.totalAmount && b.totalAmount > 0) {
      priceScore = Math.min(1, minPrice / b.totalAmount);
    }

    //completeness score
    const flags = ["hasPrices", "hasDelivery", "hasWarranty"];
    const trueCount = flags.reduce(
      (acc, key) => acc + (b.completeness?.[key] ? 1 : 0),
      0
    );
    const completenessScore = trueCount / flags.length;

    //delivery score
    let deliveryScore = 0.5;
    if (b.leadTimeDays && b.leadTimeDays > 0) {
      if (requiredDays) {
        deliveryScore =
          b.leadTimeDays <= requiredDays
            ? 1
            : Math.max(0, requiredDays / b.leadTimeDays);
      } else if (bestLead) {
        deliveryScore = Math.min(1, bestLead / b.leadTimeDays);
      }
    }

    //warranty score
    let warrantyScore = 0.5;
    if (b.warrantyMonths && b.warrantyMonths > 0) {
      if (requiredWarranty) {
        warrantyScore = Math.min(1, b.warrantyMonths / requiredWarranty);
      } else if (maxWarranty) {
        warrantyScore = Math.min(1, b.warrantyMonths / maxWarranty);
      } else {
        warrantyScore = 1;
      }
    }

    //payment score
    const payment = (b.paymentTerms || "").toLowerCase();
    const requiredPay = (rfpSpec.paymentTerms || "").toLowerCase();
    let paymentScore = 0.6;
    if (requiredPay && payment.includes(requiredPay)) {
      paymentScore = 1;
    } else if (payment.includes("net 30")) {
      paymentScore = 0.9;
    } else if (payment.includes("net 45") || payment.includes("net 60")) {
      paymentScore = 0.7;
    } else if (payment.includes("advance") || payment.includes("prepaid")) {
      paymentScore = 0.4;
    }

    const overallScore =
      priceScore * WEIGHTS.price +
      completenessScore * WEIGHTS.completeness +
      deliveryScore * WEIGHTS.delivery +
      warrantyScore * WEIGHTS.warranty +
      paymentScore * WEIGHTS.payment;

    return {
      ...b,
      scores: {
        priceScore,
        completenessScore,
        deliveryScore,
        warrantyScore,
        paymentScore,
        overallScore,
      },
    };
  });

  return {
    proposalsWithScores: withScores,
    weights: WEIGHTS,
    globals: { minPrice, bestLead, maxWarranty, requiredDays, requiredWarranty },
  };
};


module.exports = {
   buildProposalMetrics
}