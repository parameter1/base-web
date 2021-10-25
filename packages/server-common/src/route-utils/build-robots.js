export default ({ conf } = {}) => {
  const lines = [];
  conf.getAsMap('robots.directives').forEach((values, userAgent) => {
    lines.push(`User-agent: ${userAgent}`);
    values.forEach((value) => lines.push(value));
  });

  return [
    ...(conf.get('robots.enabled')
      ? lines
      : [
        'User-agent: *',
        'Disallow: /',
        '',
        '# WHEN IN PRODUCTION',
        ...lines.map((l) => `# ${l}`),
      ]
    ),
  ].join('\n');
};
