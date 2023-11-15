"use strict";

/**
 * element toggle function
 */

const elemToggleFunc = function (elem) {
  elem.classList.toggle("active");
};

/**
 * navbar toggle
 */

const navbar = document.querySelector("[data-navbar]");
const overlay = document.querySelector("[data-overlay]");
const navCloseBtn = document.querySelector("[data-nav-close-btn]");
const navOpenBtn = document.querySelector("[data-nav-open-btn]");
const navbarLinks = document.querySelectorAll("[data-nav-link]");

const navElemArr = [overlay, navCloseBtn, navOpenBtn];

/**
 * close navbar when click on any navbar link
 */

for (let i = 0; i < navbarLinks.length; i++) {
  navElemArr.push(navbarLinks[i]);
}

/**
 * addd event on all elements for toggling navbar
 */

for (let i = 0; i < navElemArr.length; i++) {
  navElemArr[i].addEventListener("click", function () {
    elemToggleFunc(navbar);
    elemToggleFunc(overlay);
  });
}

/**
 * header active state
 */

const header = document.querySelector("[data-header]");

window.addEventListener("scroll", function () {
  window.scrollY >= 400
    ? header.classList.add("active")
    : header.classList.remove("active");
});

// Function to handle Plug wallet connection
const connectWallet = async () => {
  // Canister Ids
  const nnsCanisterId = "qoctq-giaaa-aaaaa-aaaea-cai";

  // Whitelist
  const whitelist = [nnsCanisterId];

  // Host
  const host = "https://mainnet.dfinity.network";

  // Callback to print sessionData
  const onConnectionUpdate = () => {
    console.log(window.ic.plug.sessionManager.sessionData);
  };

  // Make the request
  try {
    const publicKey = await window.ic.plug.requestConnect({
      whitelist,
      host,
      onConnectionUpdate,
      timeout: 50000,
    });

    // Access wallet address from sessionData
    const walletAddress =
      window.ic.plug.sessionManager.sessionData?.principalId;
    // document.getElementById('connectWalletBtn').innerHTML = walletAddress;
    // ocument.getElementById('connectWalletBtn').style.background = 'green';

    const connectWalletBtn = document.getElementById("connectWalletBtn");
    // const walletAddress = publicKey?.derKey?.principalId || publicKey?.rawKey?.toString();

    const checkmarkSymbol = '<span style="font-size: 20px; margin:auto;">&#9989</span>';
    connectWalletBtn.innerHTML = walletAddress+' '+ checkmarkSymbol;
    connectWalletBtn.style.background = "green"; // Change the background color to green
    connectWalletBtn.style.borderColor = "green";
    connectWalletBtn.style.fontSize = '0.8rem';
    connectWalletBtn.style.width = '50%';
  connectWalletBtn.style.padding = '20px';
  connectWalletBtn.style.textAlign = 'center';
    console.log(`The connected user's wallet address is:`, walletAddress);
  } catch (e) {
    console.log(e);
  }
};

// Function to verify and reconnect if necessary
const verifyAndReconnect = async () => {
  const connected = await window.ic.plug.isConnected();
  if (!connected) {
    await connectWallet();
  }
};

// Event listener for the "Connect Wallet" button
document.addEventListener("DOMContentLoaded", function () {
  const connectWalletBtn = document.getElementById("connectWalletBtn");

  connectWalletBtn.addEventListener("click", async function () {
    await connectWallet();
  });

  // Check connection status on page load
  verifyAndReconnect();
});
