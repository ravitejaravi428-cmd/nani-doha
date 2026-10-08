import { OFFICIAL_QATAR_HOST_PHONE_DIGITS, OFFICIAL_QATAR_HOST_PHONE } from "../data/qatarLocations";

/**
 * Builds a comprehensive WhatsApp order notification message for the store host/admin (+974 7028 4220).
 */
export const buildHostOrderWhatsAppMessage = (order) => {
  if (!order) return "";

  const addr = order.shippingAddress || {};
  const formattedAddress = [
    addr.building || addr.street,
    addr.street,
    addr.zone,
    addr.area,
    addr.city ? `${addr.city}, Qatar` : "Qatar"
  ].filter(Boolean).join(", ");

  const itemsList = (order.items || []).map((item, idx) => {
    const name = item.product?.name || "Product";
    const qty = item.quantity || 1;
    const price = item.product?.price || 0;
    const color = item.selectedColor ? ` [Color: ${item.selectedColor}]` : "";
    const size = item.selectedSize ? ` [Size: ${item.selectedSize}]` : "";
    return `${idx + 1}. *${name}* (x${qty}) - QAR ${(price * qty).toFixed(2)}${color}${size}`;
  }).join("\n");

  const orderDateStr = order.orderDate
    ? new Date(order.orderDate).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })
    : new Date().toLocaleDateString();

  return `🚨 *NEW ORDER RECEIVED! — NANI DOHA OFFICIAL STORE* 🛍️
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🆔 *Order Reference:* #${order.id}
📅 *Placed On:* ${orderDateStr}
🏷️ *Type:* ${order.isTrialOrder ? "🧪 Official Trial Order" : "🛒 Customer Store Order"}

👤 *Customer Name:* ${addr.fullName || "Valued Customer"}
📞 *Contact Phone:* ${addr.phone || "N/A"}
📍 *Qatar Delivery Address:*
${formattedAddress}
${addr.landmark ? `📍 *Landmark:* ${addr.landmark}\n` : ""}${addr.notes ? `📝 *Note:* ${addr.notes}\n` : ""}
📦 *Items Ordered (${(order.items || []).length}):*
${itemsList}

💰 *Subtotal:* QAR ${Number(order.subtotal || 0).toFixed(2)}
${order.discount ? `🎟️ *Discount:* -QAR ${Number(order.discount).toFixed(2)}\n` : ""}🚚 *Shipping:* ${Number(order.shippingFee || 0) === 0 ? "FREE" : `QAR ${Number(order.shippingFee).toFixed(2)}`}
💵 *TOTAL AMOUNT:* QAR ${Number(order.totalAmount || 0).toFixed(2)}
💳 *Payment Method:* ${order.paymentMethod || "Cash on Delivery"}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ *Store Action Required:*
Hello Host Nani (+974 7028 4220)! A new order has been placed on the official web store. Please review and arrange packaging & express dispatch in Qatar. 🙏🏻`;
};

/**
 * Generates the WhatsApp deep link directed to the host phone (+974 7028 4220).
 */
export const getHostOrderWhatsAppUrl = (order) => {
  const message = buildHostOrderWhatsAppMessage(order);
  return `https://wa.me/${OFFICIAL_QATAR_HOST_PHONE_DIGITS}?text=${encodeURIComponent(message)}`;
};

/**
 * Triggers the WhatsApp notification link in a new tab.
 */
export const notifyHostOnWhatsApp = (order) => {
  try {
    const url = getHostOrderWhatsAppUrl(order);
    if (typeof window !== "undefined") {
      window.open(url, "_blank");
      return true;
    }
  } catch (err) {
    console.warn("Failed to open WhatsApp order alert:", err);
  }
  return false;
};
