export const ExternalLink = ({ children, to, label, ...props }) => {
  return (
    <a href={to} target="_blank" rel="noopener noreferrer" {...props}>
      {children || label || to}
    </a>
  );
};

export const DownloadLink = ({ children, to, label, ...props }) => {
  return (
    <a href={to} download {...props}>
      {children || label || to}
    </a>
  );
};
