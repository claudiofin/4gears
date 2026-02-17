import { Outfit } from 'next/font/google';

const outfit = Outfit({ subsets: ['latin'] });

export default function PrivacyPolicy() {
    return (
        <div className={`min-h-screen bg-slate-950 text-slate-300 p-6 md:p-12 ${outfit.className}`}>
            <div className="max-w-3xl mx-auto space-y-8">
                <header className="border-b border-slate-800 pb-8">
                    <h1 className="text-3xl font-black text-white uppercase tracking-tight mb-2">Privacy Policy</h1>
                    <p className="text-slate-500 text-sm">Last updated: {new Date().toLocaleDateString()}</p>
                </header>

                <section className="space-y-4">
                    <h2 className="text-xl font-bold text-white">1. Introduction</h2>
                    <p>
                        Welcome to 4Gears. We respect your privacy and are committed to protecting your personal data.
                        This privacy policy will inform you as to how we look after your personal data when you visit our website
                        and tell you about your privacy rights and how the law protects you.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-bold text-white">2. Data We Collect</h2>
                    <p>
                        We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-slate-400">
                        <li><strong className="text-white">Identity Data</strong> includes first name, last name, username or similar identifier.</li>
                        <li><strong className="text-white">Contact Data</strong> includes email address and telephone numbers.</li>
                        <li><strong className="text-white">Technical Data</strong> includes internet protocol (IP) address, login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform.</li>
                        <li><strong className="text-white">Usage Data</strong> includes information about how you use our website, products and services.</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-bold text-white">3. How We Use Your Data</h2>
                    <p>
                        We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-slate-400">
                        <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
                        <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                        <li>Where we need to comply with a legal or regulatory obligation.</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-bold text-white">4. Data Security</h2>
                    <p>
                        We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorised way, altered or disclosed.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-bold text-white">5. Contact Us</h2>
                    <p>
                        If you have any questions about this privacy policy or our privacy practices, please contact us at: <a href="mailto:support@4gears.app" className="text-indigo-400 hover:text-indigo-300">support@4gears.app</a>
                    </p>
                </section>
            </div>
        </div>
    );
}
