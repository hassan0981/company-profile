self.__BUILD_MANIFEST = {
  "__rewrites": {
    "afterFiles": [
      {
        "source": "/sitemap_index.xml",
        "destination": "/sitemap.xml"
      },
      {
        "source": "/sitemap-0.xml",
        "destination": "/sitemap.xml"
      }
    ],
    "beforeFiles": [],
    "fallback": []
  },
  "sortedPages": [
    "/_app",
    "/_error"
  ]
};self.__BUILD_MANIFEST_CB && self.__BUILD_MANIFEST_CB()