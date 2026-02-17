import { Outfit } from 'next/font/google';

const outfit = Outfit({ subsets: ['latin'] });

export default function TermsOfService() {
    return (
        <div className={`min-h-screen bg-slate-950 text-slate-300 p-6 md:p-12 ${outfit.className}`}>
            <div className="max-w-3xl mx-auto space-y-8">
                <header className="border-b border-slate-800 pb-8">
                    <h1 className="text-3xl font-black text-white uppercase tracking-tight mb-2">Terms of Service</h1>
                    <p className="text-slate-500 text-sm">Last updated: {new Date().toLocaleDateString()}</p>
                </header>

                <section className="space-y-4">
                    <h2 className="text-xl font-bold text-white">1. Introduction</h2>
                    <p>
                        These terms and conditions outline the rules and regulations for the use of 4Gears's Website and Services.
                        By accessing this website we assume you accept these terms and conditions. Do not continue to use 4Gears if you do not agree to take all of the terms and conditions stated on this page.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-bold text-white">2. License</h2>
                    <p>
                        Unless otherwise stated, 4Gears and/or its licensors own the intellectual property rights for all material on 4Gears. All intellectual property rights are reserved. You may access this from 4Gears for your own personal use subjected to restrictions set in these terms and conditions.
                    </p>
                    <p className="text-slate-400">You must not:</p>
                    <ul className="list-disc pl-5 space-y-2 text-slate-400">
                        <li>Republish material from 4Gears</li>
                        <li>Sell, rent or sub-license material from 4Gears</li>
                        <li>Reproduce, duplicate or copy material from 4Gears</li>
                        <li>Redistribute content from 4Gears</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-bold text-white">3. User Content</h2>
                    <p>
                        Parts of this website offer an opportunity for users to post and exchange opinions and information in certain areas of the website (e.g., team chat, tactical boards). 4Gears does not filter, edit, publish or review Comments prior to their presence on the website. Comments do not reflect the views and opinions of 4Gears,its agents and/or affiliates.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-bold text-white">4. Payment and Subscriptions</h2>
                    <p>
                        Certain services on the platform are paid. By selecting a subscription plan, you agree to pay the fees indicated for that service. Payments will be charged on a pre-pay basis on the day you sign up for a Premium Service and will cover the use of that service for a monthly or annual subscription period as indicated.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-bold text-white">5. Termination</h2>
                    <p>
                        We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-bold text-white">6. Contact Us</h2>
                    <p>
                        If you have any questions about our Terms of Service, please contact us at: <a href="mailto:support@4gears.app" className="text-indigo-400 hover:text-indigo-300">support@4gears.app</a>
                    </p>
                </section>
            </div>
        </div>
    );
}
