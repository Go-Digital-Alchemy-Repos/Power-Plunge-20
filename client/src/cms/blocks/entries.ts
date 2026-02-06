import { registerBlock } from "./registry";
import {
  textField,
  textareaField,
  numberField,
  selectField,
  checkboxField,
  arrayField,
} from "./helpers";

import HeroBlock from "./HeroBlock";
import RichTextBlock from "./RichTextBlock";
import ImageBlock from "./ImageBlock";
import ImageGridBlock from "./ImageGridBlock";
import FeatureListBlock from "./FeatureListBlock";
import TestimonialsBlock from "./TestimonialsBlock";
import FAQBlock from "./FAQBlock";
import CallToActionBlock from "./CallToActionBlock";
import ProductGridBlock from "./ProductGridBlock";
import ProductHighlightBlock from "./ProductHighlightBlock";
import TrustBarBlock from "./TrustBarBlock";
import ComparisonTableBlock from "./ComparisonTableBlock";

export function registerCmsV1Blocks() {
  registerBlock({
    type: "hero",
    label: "Hero",
    category: "layout",
    version: 1,
    description: "Full-width hero section with headline, subheadline, and CTA",
    renderComponent: HeroBlock,
    defaultProps: {
      headline: "Welcome to Power Plunge",
      subheadline: "",
      ctaText: "Shop Now",
      ctaHref: "/shop",
      backgroundImage: "",
      align: "center",
      themeVariant: "",
    },
    puckFields: {
      headline: textField("Headline"),
      subheadline: textareaField("Subheadline"),
      ctaText: textField("CTA Button Text"),
      ctaHref: textField("CTA Button Link"),
      backgroundImage: textField("Background Image URL"),
      align: selectField("Alignment", [
        { label: "Center", value: "center" },
        { label: "Left", value: "left" },
      ]),
      themeVariant: selectField("Theme Variant", [
        { label: "Default", value: "" },
        { label: "Ice Gradient", value: "ice" },
      ]),
    },
  });

  registerBlock({
    type: "richText",
    label: "Rich Text",
    category: "content",
    version: 1,
    description: "Text content block with optional title and HTML body",
    renderComponent: RichTextBlock,
    defaultProps: {
      title: "",
      bodyRichText: "<p>Enter your content here...</p>",
      align: "left",
    },
    puckFields: {
      title: textField("Title"),
      bodyRichText: textareaField("Body (HTML)"),
      align: selectField("Alignment", [
        { label: "Left", value: "left" },
        { label: "Center", value: "center" },
        { label: "Right", value: "right" },
      ]),
    },
  });

  registerBlock({
    type: "image",
    label: "Image",
    category: "media",
    version: 1,
    description: "Single image with optional caption and link",
    renderComponent: ImageBlock,
    defaultProps: {
      src: "",
      alt: "",
      caption: "",
      aspectRatio: "",
      rounded: true,
      linkHref: "",
    },
    puckFields: {
      src: textField("Image URL"),
      alt: textField("Alt Text"),
      caption: textField("Caption"),
      aspectRatio: selectField("Aspect Ratio", [
        { label: "Auto", value: "" },
        { label: "16:9", value: "16:9" },
        { label: "4:3", value: "4:3" },
        { label: "1:1", value: "1:1" },
      ]),
      rounded: checkboxField("Rounded Corners"),
      linkHref: textField("Link URL"),
    },
  });

  registerBlock({
    type: "imageGrid",
    label: "Image Grid",
    category: "media",
    version: 1,
    description: "Grid of images with optional captions and links",
    renderComponent: ImageGridBlock,
    defaultProps: {
      items: [],
      columns: 3,
      spacing: "normal",
    },
    puckFields: {
      columns: numberField("Columns", 2, 4),
      spacing: selectField("Spacing", [
        { label: "Tight", value: "tight" },
        { label: "Normal", value: "normal" },
        { label: "Loose", value: "loose" },
      ]),
      items: arrayField("Images", {
        src: textField("Image URL"),
        alt: textField("Alt Text"),
        caption: textField("Caption"),
        linkHref: textField("Link URL"),
      }),
    },
  });

  registerBlock({
    type: "featureList",
    label: "Feature List",
    category: "content",
    version: 1,
    description: "List of features with icons, titles, and descriptions",
    renderComponent: FeatureListBlock,
    defaultProps: {
      title: "",
      items: [],
      columns: 3,
    },
    puckFields: {
      title: textField("Section Title"),
      columns: numberField("Columns", 1, 3),
      items: arrayField("Features", {
        icon: textField("Icon (Lucide name)"),
        title: textField("Title"),
        description: textareaField("Description"),
      }),
    },
  });

  registerBlock({
    type: "testimonials",
    label: "Testimonials",
    category: "social",
    version: 1,
    description: "Customer testimonials in cards or slider layout",
    renderComponent: TestimonialsBlock,
    defaultProps: {
      title: "What Our Customers Say",
      items: [],
      layout: "cards",
    },
    puckFields: {
      title: textField("Section Title"),
      layout: selectField("Layout", [
        { label: "Cards Grid", value: "cards" },
        { label: "Slider", value: "slider" },
      ]),
      items: arrayField("Testimonials", {
        quote: textareaField("Quote"),
        name: textField("Name"),
        title: textField("Title / Role"),
        avatar: textField("Avatar URL"),
      }),
    },
  });

  registerBlock({
    type: "faq",
    label: "FAQ",
    category: "content",
    version: 1,
    description: "Accordion-style frequently asked questions",
    renderComponent: FAQBlock,
    defaultProps: {
      title: "Frequently Asked Questions",
      items: [],
      allowMultipleOpen: false,
    },
    puckFields: {
      title: textField("Section Title"),
      allowMultipleOpen: checkboxField("Allow Multiple Open"),
      items: arrayField("Questions", {
        q: textField("Question"),
        a: textareaField("Answer"),
      }),
    },
  });

  registerBlock({
    type: "callToAction",
    label: "Call to Action",
    category: "layout",
    version: 1,
    description: "Conversion-focused CTA section with primary and secondary buttons",
    renderComponent: CallToActionBlock,
    defaultProps: {
      headline: "Ready to Transform Your Recovery?",
      subheadline: "",
      primaryCtaText: "Get Started",
      primaryCtaHref: "/shop",
      secondaryCtaText: "",
      secondaryCtaHref: "",
    },
    puckFields: {
      headline: textField("Headline"),
      subheadline: textareaField("Subheadline"),
      primaryCtaText: textField("Primary CTA Text"),
      primaryCtaHref: textField("Primary CTA Link"),
      secondaryCtaText: textField("Secondary CTA Text"),
      secondaryCtaHref: textField("Secondary CTA Link"),
    },
  });

  registerBlock({
    type: "productGrid",
    label: "Product Grid",
    category: "commerce",
    version: 1,
    description: "Display products in a grid with optional filtering by IDs or tags",
    renderComponent: ProductGridBlock,
    defaultProps: {
      title: "Our Products",
      productIds: [],
      collectionTag: "",
      queryMode: "all",
      columns: 3,
      showPrice: true,
    },
    puckFields: {
      title: textField("Section Title"),
      queryMode: selectField("Query Mode", [
        { label: "All Products", value: "all" },
        { label: "By IDs", value: "ids" },
        { label: "By Tag", value: "tag" },
      ]),
      collectionTag: textField("Collection Tag (for tag mode)"),
      columns: numberField("Columns", 2, 4),
      showPrice: checkboxField("Show Price"),
    },
  });

  registerBlock({
    type: "productHighlight",
    label: "Product Highlight",
    category: "commerce",
    version: 1,
    description: "Detailed single product showcase with gallery, bullets, and buy button",
    renderComponent: ProductHighlightBlock,
    defaultProps: {
      productId: "",
      highlightBullets: [],
      showGallery: true,
      showBuyButton: true,
    },
    puckFields: {
      productId: textField("Product ID"),
      showGallery: checkboxField("Show Image Gallery"),
      showBuyButton: checkboxField("Show Buy Button"),
    },
  });

  registerBlock({
    type: "trustBar",
    label: "Trust Bar",
    category: "social",
    version: 1,
    description: "Row of trust signals with icons, labels, and sublabels",
    renderComponent: TrustBarBlock,
    defaultProps: {
      items: [],
      layout: "row",
    },
    puckFields: {
      layout: selectField("Layout", [
        { label: "Row", value: "row" },
        { label: "Wrap Grid", value: "wrap" },
      ]),
      items: arrayField("Trust Items", {
        icon: textField("Icon (Lucide name)"),
        label: textField("Label"),
        sublabel: textField("Sublabel"),
      }),
    },
  });

  registerBlock({
    type: "comparisonTable",
    label: "Comparison Table",
    category: "commerce",
    version: 1,
    description: "Feature comparison table with highlight column support",
    renderComponent: ComparisonTableBlock,
    defaultProps: {
      title: "",
      columns: [],
      rows: [],
      highlightColumnKey: "",
    },
    puckFields: {
      title: textField("Table Title"),
      highlightColumnKey: textField("Highlight Column Key"),
      columns: arrayField("Columns", {
        key: textField("Key"),
        label: textField("Label"),
      }),
      rows: arrayField("Rows", {
        label: textField("Feature Label"),
      }),
    },
  });
}
