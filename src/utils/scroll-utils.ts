import type React from "react"

/**
 * Scrolls to a specific section with proper positioning
 * @param sectionId The ID of the section to scroll to
 */
export function scrollToSection(e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) {
  e.preventDefault()

  // Special handling for pricing section
  if (sectionId === "pricing") {
    scrollToPricing()
    return
  }

  const section = document.getElementById(sectionId)
  if (section) {
    const sectionRect = section.getBoundingClientRect()
    const absolutePosition = sectionRect.top + window.pageYOffset

    window.scrollTo({
      top: absolutePosition - 80,
      behavior: "smooth",
    })
    window.history.pushState(null, "", `#${sectionId}`)
  }
}

/**
 * Directly scrolls to the pricing section
 */
export function scrollToPricing() {
  const pricingTitle = document.getElementById("pricing-title")

  if (pricingTitle) {
    const titleRect = pricingTitle.getBoundingClientRect()
    const absolutePosition = titleRect.top + window.pageYOffset

    // Scroll to position the pricing title at the top with just enough space for the navbar
    window.scrollTo({
      top: absolutePosition - 100,
      behavior: "smooth",
    })

    window.history.pushState(null, "", "#pricing")
  } else {
    // Fallback to the pricing section if title not found
    const section = document.getElementById("pricing")
    if (section) {
      const sectionRect = section.getBoundingClientRect()
      window.scrollTo({
        top: sectionRect.top + window.pageYOffset - 80,
        behavior: "smooth",
      })
      window.history.pushState(null, "", "#pricing")
    }
  }
}

