export default function LegalSection({ title, decorated = false, children }) {
  return (
    <section>
      <h2 className={decorated ? 'text-lg lg:text-xl font-bold text-gray-800 mb-3 flex items-center gap-2' : 'text-lg lg:text-xl font-bold text-gray-800 mb-3'}>{title}</h2>
      {children}
    </section>
  );
}
