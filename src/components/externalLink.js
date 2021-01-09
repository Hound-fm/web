export const ExternalLink = ({ children, path, label, ...props }) => {
  return (
    <a href={path} target="_blank" rel="noopener noreferrer" {...props}>
      {children || label || path}
    </a>
  );
};

export const DownloadLink = ({ children, path, label, ...props }) => {
  return (
    <a href={path} download {...props}>
      {children || label || path}
    </a>
  );
};
