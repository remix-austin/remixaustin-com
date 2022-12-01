const year = new Date().getFullYear().toString();
export const copyrightText = `Copyright © ${year} Remix Austin - All rights reserved.`;

export default function Footer() {
  return (
    <footer className="footer footer-center sticky top-full mt-16 bg-base-300 p-8 text-base-content">
      <div>
        <p>{copyrightText}</p>
      </div>
    </footer>
  );
}
