import React from "react";

export let appsState = {
  cachedHomeThreads: null,
  offset: 0,
  loggedInUserProfile: null,
  visitedProfiles: null,
};

export default function Layout({ children }) {
  return (
    <div id="container">
      <div id="dim-overlay" className="hidden"></div>
      <div className="create-post-popper hidden"></div>
      <div className="create-post-notifier hidden"></div>

      <nav id="navigation">
        {/* You can add navigation links or a separate Navigation component here */}
      </nav>

      <main id="main">{children}</main>

      <footer id="footer">{/* You can add footer content here */}</footer>
    </div>
  );
}
