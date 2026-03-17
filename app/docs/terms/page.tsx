export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:px-12 md:py-16 text-slate-800 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-slate-900">Terms of Service</h1>
      <p className="text-base text-slate-600 mb-6 leading-relaxed">
        Last updated: March 2026
      </p>
      <hr className="border-slate-100 mb-12" />
      
      <div className="space-y-8 text-slate-600">
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">1. Acceptance of Terms</h3>
          <p>By accessing or using the Opensperm platform, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.</p>
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">2. Use of Service</h3>
          <p>You are responsible for safeguarding the password and private keys that you use to access the service. Opensperm cannot and will not be liable for any loss or damage arising from your failure to comply with this security obligation.</p>
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">3. Acceptable Use</h3>
          <p>You agree not to use the platform to run agents that engage in illegal activities, spamming, or attacks against other networks. We reserve the right to terminate pods that violate these guidelines.</p>
        </div>
      </div>


      <div className="text-center text-sm text-slate-500 pb-8">© 2026 Opensperm.io · Terms · Privacy · Disclaimer</div>
    </div>
  );
}
