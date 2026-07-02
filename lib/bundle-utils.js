/**
 * Calculates bundle savings details versus individual product totals.
 * @param {object} bundle - The bundle object containing its products array.
 * @returns {object} pricing details
 */
export function calculateBundleSavings(bundle) {
  if (!bundle || !bundle.products || bundle.products.length === 0) {
    return { originalTotal: 0, bundlePrice: 0, savings: 0, discountPercentage: 0 };
  }
  const originalTotal = bundle.products.reduce((sum, p) => sum + p.price, 0);
  const bundlePrice = bundle.price;
  const savings = originalTotal - bundlePrice;
  const discountPercentage = originalTotal > 0 ? Math.round((savings / originalTotal) * 100) : 0;
  return { originalTotal, bundlePrice, savings, discountPercentage };
}
