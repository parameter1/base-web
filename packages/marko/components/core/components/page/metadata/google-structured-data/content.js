const objectPath = require('@parameter1/base-web-object-path');

const { getAsArray } = objectPath;

const get = (o, path) => {
  const v = objectPath.get(o, path);
  return v == null ? undefined : v;
};

const getAuthor = (node) => {
  const authors = getAsArray(node, 'authors.edges').map((e) => get(e, 'node.name'));
  return authors.length ? { '@type': 'Person', name: authors.join(', ') } : undefined;
};

const getImages = (node) => {
  const images = getAsArray(node, 'images.edges').map((e) => get(e, 'node.src'));
  return images.length ? images : undefined;
};

module.exports = (node) => {
  const publishedISOString = node.published ? (new Date(node.published)).toISOString() : undefined;
  const updatedISOString = node.updated ? (new Date(node.updated)).toISOString() : undefined;
  const siteUrl = get(node, 'siteContext.url');
  const canonicalUrl = get(node, 'siteContext.canonicalUrl');

  const defaultStruturedData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': get(node, 'siteContext.canonicalUrl'),
    },
    headline: get(node, 'metadata.title'),
    name: get(node, 'metadata.title'),
    ...(get(node, 'metadata.description') && { description: get(node, 'metadata.description') }),
    ...(get(node, 'metadata.image.src') && { thumbnailUrl: get(node, 'metadata.image.src') }),
    ...(getImages(node) && { image: getImages(node) }),
    datePublished: publishedISOString,
    dateModified: updatedISOString,
    url: canonicalUrl,
    ...(siteUrl !== canonicalUrl && { url: siteUrl, isBasedOn: canonicalUrl }),
    ...(getAuthor(node) && { author: getAuthor(node) }),
  };

  if (node.type === 'video') {
    return JSON.stringify({
      ...defaultStruturedData,
      '@type': 'VideoObject',
      uploadDate: publishedISOString,
      contentUrl: get(node, 'siteContext.canonicalUrl'),
      embedUrl: get(node, 'embedSrc'),
    });
  }

  if (node.type === 'podcast') {
    // Set associatedMedia if audio file is present
    const associatedMedia = (get(node, 'fileName') && get(node, 'fileSrc'))
      ? {
        '@type': 'AudioObject',
        contentUrl: get(node, 'fileSrc'),
        name: get(node, 'fileName'),
      }
      : undefined;
    return JSON.stringify({
      ...defaultStruturedData,
      '@type': 'PodcastEpisode',
      headline: get(node, 'metadata.title'),
      ...(associatedMedia && { associatedMedia }),
    });
  }

  if (node.type === 'company') {
    // Concat address1 && address2 if present
    const streetAddresses = [];
    if (get(node, 'address1')) streetAddresses.push(get(node, 'address1'));
    if (get(node, 'address2')) streetAddresses.push(get(node, 'address2'));
    const streetAddress = streetAddresses.join(' ');
    // Display and set address info if present
    const showAddress = (streetAddress || get(node, 'city') || get(node, 'state') || get(node, 'zip'));
    const address = (showAddress)
      ? {
        '@type': 'PostalAddress',
        ...(get(node, 'city') && { addressLocality: get(node, 'city') }),
        ...(get(node, 'state') && { addressLocality: get(node, 'state') }),
        ...(get(node, 'zip') && { postalCode: get(node, 'zip') }),
        ...(streetAddress && { streetAddress }),
      }
      : undefined;
    // Set tollfree || phone if present
    const telephone = get(node, 'tollfree') || get(node, 'phone');

    return JSON.stringify({
      ...defaultStruturedData,
      '@type': 'Organization',
      address,
      ...(telephone && { telephone }),
      ...(get(node, 'metadata.image.src') && { logo: get(node, 'metadata.image.src') }),
      ...(get(node, 'email') && { email: get(node, 'email') }),
      ...(get(node, 'fax') && { faxNumber: get(node, 'fax') }),
    });
  }

  if (['article', 'news'].includes(node.type)) {
    return JSON.stringify({
      ...defaultStruturedData,
      '@type': 'NewsArticle',
      headline: get(node, 'metadata.title'),
    });
  }

  return undefined;
};
