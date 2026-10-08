import { useParams, Navigate } from "react-router-dom";
import { DEFAULT_LANGUAGE } from "@/lib/i18n";

type RedirectWithParamsProps = {
  basePath: string;
};

export default function RedirectWithParams({ basePath }: RedirectWithParamsProps) {
  const params = useParams();
  
  // Build the new path with all params
  const paramString = Object.entries(params)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  
  // Construct the redirect URL
  let newPath = `/${DEFAULT_LANGUAGE}${basePath}`;
  
  // For paths with :param, replace the param placeholder with actual value
  if (params.slug) {
    newPath = `/${DEFAULT_LANGUAGE}${basePath.replace(":slug", params.slug)}`;
  }
  
  return <Navigate to={newPath} replace />;
}

