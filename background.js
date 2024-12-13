// Declare formattedQuestions in a broader scope
let formattedQuestions = []; // Initialize as an empty array

chrome.runtime.onInstalled.addListener(() => {
  // context menu setup
  chrome.contextMenus.create({
    id: "searchPerplexity",
    title: "Search Perplexity for \"%s\"",
    contexts: ["selection"]
  });

  const questionFormats = [
    "What is %s?",
    "Explain %s.",
    "How does %s work?"
  ];

  // Store formatted questions in the array
  formattedQuestions = questionFormats.map((format, index) => {
    chrome.contextMenus.create({
      id: `formatQuestion${index}`,
      title: format,
      contexts: ["selection"]
    });
    return format; // Store the format for later use
  });

  // Add a donate menu item
  chrome.contextMenus.create({
    id: "donate",
    title: "Buy me a coffee",
    contexts: ["all"] // Visible regardless of text selection
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId.startsWith("formatQuestion")) {
    const formatIndex = info.menuItemId.replace("formatQuestion", "");
    const selectedText = info.selectionText;
    const formattedQuestion = formattedQuestions[formatIndex].replace("%s", selectedText); // Use the stored format

    const searchUrl = `https://www.perplexity.ai/?q=${encodeURIComponent(formattedQuestion)}`;
    chrome.tabs.create({ url: searchUrl });
  } else if (info.menuItemId === "searchPerplexity") {
    const searchUrl = `https://www.perplexity.ai/?q=${encodeURIComponent(info.selectionText)}`;
    chrome.tabs.create({ url: searchUrl });
  } else if (info.menuItemId === "donate") {
    const donateUrl = "https://www.buymeacoffee.com/punitvara"; 
    chrome.tabs.create({ url: donateUrl });
  }
});
