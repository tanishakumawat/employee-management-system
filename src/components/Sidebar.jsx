import {
    Users,
    X,
    Settings,
    CircleHelp,
    ShieldCheck,
    LogOut,
} from "lucide-react";

export default function Sidebar({
    sidebarOpen,
    setSidebarOpen,
    navItems,
    showToast,
}) {
    return (
        <>
            {sidebarOpen && (
                <button
                    type="button"
                    aria-label="Close navigation"
                    className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="flex h-[76px] items-center gap-3 border-b border-slate-100 px-6">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-200">
                        <Users size={22} />
                    </div>
                    <div>
                        <p className="text-[15px] font-bold tracking-tight text-slate-900">
                            PeopleFlow
                        </p>
                        <p className="text-xs text-slate-500">Employee workspace</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setSidebarOpen(false)}
                        className="ml-auto rounded-lg p-1 text-slate-500 hover:bg-slate-100 lg:hidden"
                        aria-label="Close sidebar"
                    >
                        <X size={19} />
                    </button>
                </div>

                <div className="px-4 pt-7">
                    <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                        Workspace
                    </p>
                    <nav className="space-y-1">
                        {navItems.map(({ label, icon: Icon }) => {
                            const selected = label === "Employees";
                            return (
                                <button
                                    type="button"
                                    key={label}
                                    onClick={() => {
                                        if (label !== "Employees") {
                                            showToast(`${label} is currently unavailable.`, "error");
                                        }
                                        setSidebarOpen(false);
                                    }}
                                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${selected
                                        ? "bg-indigo-50 text-indigo-700"
                                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                        }`}
                                >
                                    <Icon size={19} />
                                    {label}
                                    {selected && (
                                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-600" />
                                    )}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                <div className="mt-8 px-4">
                    <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                        Preferences
                    </p>
                    <button
                        type="button"
                        onClick={() =>
                            showToast("Settings are currently unavailable.", "error")
                        }
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    >
                        <Settings size={19} />
                        Settings
                    </button>
                    <button
                        type="button"
                        onClick={() =>
                            showToast("Help documentation is not configured yet.", "error")
                        }
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    >
                        <CircleHelp size={19} />
                        Help & support
                    </button>
                </div>

                <div className="mt-auto p-4">
                    <button
                        type="button"
                        onClick={() =>
                            showToast("Account authentication is not implemented yet.", "error")
                        }
                        className="mt-4 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-500 hover:bg-slate-50"
                    >
                        <LogOut size={18} />
                        Sign out
                    </button>
                </div>
            </aside>    </>
    );
}