export default function Footer() {
  return (
    <footer className="w-full bg-white dark:bg-neutral-950 border-t border-gray-200 dark:border-neutral-800 py-8">
      <div className="max-w-4xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#666] dark:text-neutral-400">
        <p>&copy; {new Date().getFullYear()} Pete Davidsmeier. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <a
            href="mailto:combatperfomrfit@gmail.com"
            className="hover:text-[#0A66C2] transition-colors"
          >
            combatperfomrfit@gmail.com
          </a>
          <a
            href="https://www.linkedin.com/in/pete-davidsmeier-ai-solutions"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#0A66C2] transition-colors"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/DTSP-AI"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#0A66C2] transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
