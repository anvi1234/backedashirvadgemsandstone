function stripHtml(html = "") {
  return html.replace(/<[^>]*>/g, "").trim();
}

/* =====================
   SLUG GENERATOR
===================== */

function generateSlug(name = "") {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/* =====================
   SEO GENERATOR
===================== */

function generateSEO(product) {

  const cleanDescription = stripHtml(product.shortDescription || "");

  const domain = process.env.FRONTEND_URL || "https://ashirwadrudrakshandgems.com";

  const metaDescription =
    cleanDescription.length > 160
      ? cleanDescription.substring(0, 157) + "..."
      : cleanDescription || `Buy ${product.name} at best price in India.`;

  return {

    metaTitle: `${product.name} Price in India | Buy Online`,

    metaDescription,

    metaKeywords: [
      product.name,
      `${product.name} price`,
      `${product.name} online`,
      `buy ${product.name}`,
      `${product.name} best price`,
      `cheap ${product.name}`,
      `${product.name} India`
    ],

    canonicalUrl: `${domain}/product/${product.slug}`,

    robots: "index, follow"
  };
}

/* =====================
   OPEN GRAPH GENERATOR
===================== */

function generateOpenGraph(product) {

  const cleanDescription = stripHtml(product.shortDescription || "");

  return {
    title: product.name,

    description:
      cleanDescription.substring(0, 160) ||
      `Buy ${product.name} online at best price.`,

    image: product.mainImage?.url || "",

    type: "product"
  };
}

module.exports = {
  generateSlug,
  generateSEO,
  generateOpenGraph
};