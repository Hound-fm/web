export const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text).then(
    function () {
      console.log("Copied to clipboard successfully!");
    },
    function () {
      console.error("Unable to write to clipboard. :-(");
    }
  );
};
