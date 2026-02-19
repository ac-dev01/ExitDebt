"use client";

import { Account } from "@/lib/mockProfiles";
import { formatCurrency } from "@/lib/utils";

interface AccountListProps {
    accounts: Account[];
}

function typeLabel(type: Account["type"]): string {
    switch (type) {
        case "credit_card": return "Credit Card";
        case "loan": return "Personal Loan";
        case "emi": return "EMI";
    }
}

export default function AccountList({ accounts }: AccountListProps) {
    return (
        <div className="bg-white border border-gray-100 rounded-xl overflow-hidden animate-slideUp" style={{ animationDelay: "0.2s" }}>
            <div className="px-6 py-4 border-b border-gray-50">
                <h3 className="text-sm font-semibold text-gray-900">Debt Accounts</h3>
            </div>

            {/* Desktop table */}
            <div className="hidden sm:block">
                <table className="w-full">
                    <thead>
                        <tr className="text-xs text-gray-400 uppercase tracking-wider">
                            <th className="text-left px-6 py-3 font-medium">Lender</th>
                            <th className="text-left px-6 py-3 font-medium">Type</th>
                            <th className="text-right px-6 py-3 font-medium">Outstanding</th>
                            <th className="text-right px-6 py-3 font-medium">APR</th>
                            <th className="text-right px-6 py-3 font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {accounts.map((acc, i) => (
                            <tr
                                key={acc.lender}
                                className={`text-sm border-t border-gray-50 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                                    } hover:bg-teal-50/30 transition-colors`}
                            >
                                <td className="px-6 py-3.5 font-medium text-gray-900">{acc.lender}</td>
                                <td className="px-6 py-3.5 text-gray-500">{typeLabel(acc.type)}</td>
                                <td className="px-6 py-3.5 text-right text-gray-700 font-medium tabular-nums">
                                    {formatCurrency(acc.outstanding)}
                                </td>
                                <td className={`px-6 py-3.5 text-right font-semibold tabular-nums ${acc.apr > 18 ? "text-red-600" : "text-gray-700"
                                    }`}>
                                    {acc.apr}%
                                </td>
                                <td className="px-6 py-3.5 text-right">
                                    {acc.apr > 18 ? (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-600">
                                            High Rate
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-600">
                                            OK
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden divide-y divide-gray-50">
                {accounts.map((acc) => (
                    <div key={acc.lender} className="px-5 py-4 space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="font-medium text-sm text-gray-900">{acc.lender}</span>
                            {acc.apr > 18 && (
                                <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full">High</span>
                            )}
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">{typeLabel(acc.type)}</span>
                            <span className={`font-semibold tabular-nums ${acc.apr > 18 ? "text-red-600" : "text-gray-700"}`}>
                                {acc.apr}% APR
                            </span>
                        </div>
                        <div className="text-sm font-medium text-gray-700 tabular-nums">
                            {formatCurrency(acc.outstanding)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
