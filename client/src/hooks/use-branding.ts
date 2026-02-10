import { useQuery } from "@tanstack/react-query";
import defaultLogoImage from "@assets/powerplungelogo_1767907611722.png";

interface BrandingData {
  logoUrl?: string | null;
  companyName?: string | null;
}

export function useBranding() {
  const { data } = useQuery<BrandingData>({
    queryKey: ["/api/site-settings"],
    staleTime: 5 * 60 * 1000,
    select: (d) => ({ logoUrl: d.logoUrl, companyName: d.companyName }),
  });

  return {
    logoSrc: data?.logoUrl || defaultLogoImage,
    companyName: data?.companyName || "Power Plunge",
  };
}
