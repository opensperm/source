import { Box, Server, Cpu, Star, Lock, CreditCard, Database, Download, LayoutGrid, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function DocsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:px-12 md:py-16 text-slate-800 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-slate-900">Opensperm Documentation</h1>
      
      <p className="text-base text-slate-600 mb-6 leading-relaxed">
        Learn how to deploy, manage, and operate private AI agents with Opensperm.
      </p>
      
      <p className="text-base text-slate-600 mb-12 leading-relaxed">
        Opensperm provides infrastructure to run fully private AI agents with dedicated compute, local models, and isolated environments.
      </p>

      <hr className="border-slate-100 mb-12" />

      <h2 className="text-2xl font-bold mb-6 text-slate-900">What is Opensperm</h2>
      
      <p className="text-slate-600 mb-6 leading-relaxed text-base">
        Opensperm is a private AI agent infrastructure that gives every AI agent its own isolated environment.
      </p>
      
      <p className="text-slate-600 mb-6 leading-relaxed text-base">
        Instead of relying on shared AI services or external platforms, Opensperm runs agents on dedicated machines where models, tools, and data remain fully private.
      </p>
      
      <p className="text-slate-600 mb-12 leading-relaxed text-base">
        Each agent operates independently with its own resources, allowing users to run AI agents securely while keeping their data and activity completely under their control.
      </p>

      <h3 className="text-xl font-bold mb-2 text-slate-900">Core Modules</h3>
      <p className="text-slate-500 mb-6 text-sm">The core infrastructure that powers every Opensperm agent.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {/* Agent Pods */}
        <div className="border border-slate-100 rounded-2xl p-6 bg-slate-50/50 hover:bg-slate-50 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
              <Box size={20} className="text-white" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Agent Pods</h4>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed">
            Dedicated compute environment for each agent.
          </p>
        </div>

        {/* Agent Runtime */}
        <div className="border border-slate-100 rounded-2xl p-6 bg-slate-50/50 hover:bg-slate-50 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
              <Server size={20} className="text-white" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Agent Runtime</h4>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed">
            Secure environment where agents run models, tools, and workflows.
          </p>
        </div>

        {/* Agent Models */}
        <div className="border border-slate-100 rounded-2xl p-6 bg-slate-50/50 hover:bg-slate-50 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
              <Cpu size={20} className="text-white" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Agent Models</h4>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed">
            Run local AI models directly inside each agent.
          </p>
        </div>
      </div>

      <hr className="border-slate-100 mb-12" />

      <h3 className="text-xl font-bold mb-2 text-slate-900">Platform Features</h3>
      <p className="text-slate-500 mb-6 text-sm">Additional capabilities available to every agent.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {/* Private Skills */}
        <div className="border border-slate-100 rounded-2xl p-6 bg-slate-50/50 hover:bg-slate-50 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
              <Star size={20} className="text-white" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Private Skills</h4>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed">
            Add custom capabilities to your agent.
          </p>
        </div>

        {/* Private Access */}
        <div className="border border-slate-100 rounded-2xl p-6 bg-slate-50/50 hover:bg-slate-50 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
              <Lock size={20} className="text-white" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Private Access</h4>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed">
            Securely connect to your agent anytime.
          </p>
        </div>

        {/* Private Payment */}
        <div className="border border-slate-100 rounded-2xl p-6 bg-slate-50/50 hover:bg-slate-50 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
              <CreditCard size={20} className="text-white" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Private Payment</h4>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed">
            Handle agent payments privately.
          </p>
        </div>

        {/* Private Memory */}
        <div className="border border-slate-100 rounded-2xl p-6 bg-slate-50/50 hover:bg-slate-50 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
              <Database size={20} className="text-white" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Private Memory</h4>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed">
            Store and recall information inside your agent.
          </p>
        </div>

        {/* Private Backup */}
        <div className="border border-slate-100 rounded-2xl p-6 bg-slate-50/50 hover:bg-slate-50 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
              <Download size={20} className="text-white" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Private Backup</h4>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed">
            Protect and restore your agent data.
          </p>
        </div>

        {/* App Manager */}
        <div className="border border-slate-100 rounded-2xl p-6 bg-slate-50/50 hover:bg-slate-50 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
              <LayoutGrid size={20} className="text-white" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">App Manager</h4>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed">
            Manage agent apps in one place.
          </p>
        </div>
      </div>

      {/* Next Button */}
      <div className="flex justify-end mb-16">
        <Link href="#" className="flex flex-col items-end border border-slate-200 rounded-2xl p-6 hover:border-slate-300 hover:bg-slate-50 transition-all min-w-[240px]">
          <span className="text-xs text-slate-400 mb-1">Next</span>
          <div className="flex items-center gap-2 text-slate-900 font-bold">
            Architecture <ChevronRight size={18} />
          </div>
        </Link>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-slate-500 pb-8">
        © 2026 Opensperm.io · Terms · Privacy · Disclaimer
      </div>
    </div>
  );
}
