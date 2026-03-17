export default function PrivateBackupPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:px-12 md:py-16 text-slate-800 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-slate-900">Private Backup</h1>
      <p className="text-base text-slate-600 mb-6 leading-relaxed">
        Ensure your agent's state, memory, and configurations are never lost, while keeping them cryptographically secure.
      </p>
      <hr className="border-slate-100 mb-12" />
      <h2 className="text-2xl font-bold mb-6 text-slate-900">Encrypted Snapshots</h2>
      <p className="text-slate-600 mb-6 leading-relaxed text-base">
        Opensperm allows you to take full snapshots of your Agent Pod's state. These snapshots are encrypted client-side before being stored.
      </p>
      <ul className="list-disc pl-6 space-y-4 text-slate-600 mb-12">
        <li><strong>Zero-Knowledge Storage:</strong> We store the encrypted blobs, but we do not have the keys to decrypt them. Only you hold the recovery keys.</li>
        <li><strong>Portability:</strong> Download your encrypted backups and restore them on any compatible Opensperm node or even your local hardware.</li>
        <li><strong>Automated Schedules:</strong> Configure daily or weekly automated backups via the App Manager.</li>
      </ul>

      <div className="text-center text-sm text-slate-500 pb-8">© 2026 Opensperm.io · Terms · Privacy · Disclaimer</div>
    </div>
  );
}
