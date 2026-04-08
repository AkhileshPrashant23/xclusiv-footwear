const WA_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '919594668517'

/**
 * Build a WhatsApp URL for a single product "Buy Now"
 */
export function buildBuyNowWhatsApp(product, size) {
  const msg = [
    `🛍️ *New Order – Xclusiv Footwear*`,
    ``,
    `*Product:* ${product.name}`,
    `*Brand:* ${product.brand}`,
    `*Size:* ${size}`,
    `*Price:* ₹${product.price.toLocaleString('en-IN')}`,
    ``,
    `Please confirm availability and share payment details.`,
    ``,
    `Thank you! 🙏`,
  ].join('\n')

  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`
}

/**
 * Build a WhatsApp URL for full cart checkout
 */
export function buildCartWhatsApp(items, totalAmount) {
  const itemLines = items
    .map(
      (item, idx) =>
        `${idx + 1}. ${item.name}\n   Size: ${item.selectedSize} | Qty: ${item.qty} | ₹${(item.price * item.qty).toLocaleString('en-IN')}`
    )
    .join('\n')

  const msg = [
    `🛍️ *New Order – Xclusiv Footwear*`,
    ``,
    `*Order Items:*`,
    itemLines,
    ``,
    `*Total Amount: ₹${totalAmount.toLocaleString('en-IN')}*`,
    ``,
    `Please confirm availability and share payment details.`,
    ``,
    `Thank you! 🙏`,
  ].join('\n')

  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`
}
