import { useState, useEffect } from 'react';
import { ChevronDown, HelpCircle, MessageCircle, Loader2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { faqAPI } from '../services/api';

interface FAQ {
  question: string;
  answer: string;
}

interface FAQCategory {
  title: string;
  faqs: FAQ[];
}

export default function FAQs() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);
  const [faqCategories, setFaqCategories] = useState<FAQCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const toggleFAQ = (index: string) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await faqAPI.getAllFAQs();
        
        if (response.success && response.data) {
          // Group FAQs by category
          const groupedFAQs: { [key: string]: FAQ[] } = {};
          
          response.data.forEach((faq: any) => {
            if (!groupedFAQs[faq.category]) {
              groupedFAQs[faq.category] = [];
            }
            groupedFAQs[faq.category].push({
              question: faq.question,
              answer: faq.answer,
            });
          });
          
          // Convert to FAQCategory array
          const categories: FAQCategory[] = Object.keys(groupedFAQs).map(category => ({
            title: category,
            faqs: groupedFAQs[category],
          }));
          
          setFaqCategories(categories);
        } else {
          setError('Failed to load FAQs');
        }
      } catch (err: any) {
        console.error('Error fetching FAQs:', err);
        setError(err.response?.data?.message || 'Failed to load FAQs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <p className="text-gray-600">Loading FAQs...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Failed to Load FAQs</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const mockCategories: FAQCategory[] = [
    {
      title: 'Getting Started',
      faqs: [
        {
          question: 'How does Recycle My Device work?',
          answer: "We're a comparison website that helps you find the best price for your old phone. Simply search for your device, tell us its condition, and we'll show you quotes from multiple trusted UK recyclers. Choose the best offer, complete your order, and send your phone using the free postage label. Once received, you'll get paid directly to your bank account.",
        },
        {
          question: 'Is it free to use Recycle My Device?',
          answer: "Absolutely! Our service is completely free to use. We earn a small commission from our partner recyclers when you complete a sale, but this never affects the price you receive. There are no hidden fees or costs to you.",
        },
        {
          question: 'Which devices can I sell?',
          answer: "You can sell most smartphones including all iPhone models (from iPhone 6 onwards), Samsung Galaxy devices, and other popular brands. We also accept tablets and smartwatches. If you can't find your device, contact us and we'll try to help.",
        },
        {
          question: "How do I know I'm getting the best price?",
          answer: "We compare prices from over 20 trusted UK recyclers in real-time. Our comparison tool shows you all available offers so you can choose the one that suits you best - whether that's the highest price, fastest payment, or most trusted buyer.",
        },
      ],
    },
    {
      title: 'Device Condition',
      faqs: [
        {
          question: "How do I determine my device's condition?",
          answer: "We have 5 condition grades: Like New (perfect, no signs of use), Good (minor scratches, fully working), Fair (visible wear but functional), Poor (heavy wear or minor damage), and Faulty (broken screen, battery issues, etc.). Be honest - if your device doesn't match the condition you selected, the buyer may revise the price or return it.",
        },
        {
          question: 'What if my phone has a cracked screen?',
          answer: "Cracked screens are usually classified as 'Faulty' or 'Poor' condition. You can still sell devices with cracked screens, but the price will be lower. Some buyers specialise in damaged devices, so you might be surprised at what you can still get!",
        },
        {
          question: 'Does my phone need to be working to sell it?',
          answer: "No! Many buyers accept non-working or faulty devices. Just select 'Faulty' as the condition and describe what's wrong. You'll still get quotes - just at a reduced price.",
        },
        {
          question: 'What happens if the buyer disagrees with my condition assessment?',
          answer: "If the buyer inspects your device and finds it's in worse condition than described, they'll offer you a revised price. You can accept the new offer or ask for your device to be returned (you may need to pay return postage). That's why it's important to be honest upfront!",
        },
      ],
    },
    {
      title: 'Selling Process',
      faqs: [
        {
          question: 'What do I need to do before sending my phone?',
          answer: 'Before sending your device, you should: 1) Back up your data, 2) Sign out of all accounts (iCloud, Google, Samsung), 3) Disable Find My iPhone/Android, 4) Remove your SIM and memory cards, 5) Perform a factory reset. This protects your privacy and ensures smooth processing.',
        },
        {
          question: 'How do I send my phone?',
          answer: "After completing your order, you'll receive a FREE prepaid shipping label by email. Print it out, pack your phone securely (we recommend bubble wrap), attach the label, and drop it off at any Royal Mail location or collection point. Keep your proof of postage!",
        },
        {
          question: 'Is postage really free?',
          answer: "Yes! All orders include a free prepaid Royal Mail shipping label. You don't pay anything to send your device. Just print the label and drop it off.",
        },
        {
          question: 'Can I sell multiple phones at once?',
          answer: "Yes! You can add multiple devices to your order. Each device will need to be assessed and may go to different buyers depending on who offers the best price for each one.",
        },
        {
          question: 'How long does the process take?',
          answer: 'The whole process typically takes 5-7 days: 1-2 days for your device to arrive, 1-2 days for inspection, and 1-3 days for payment to reach your account. Some buyers offer same-day payment!',
        },
      ],
    },
    {
      title: 'Payment',
      faqs: [
        {
          question: 'How do I get paid?',
          answer: "Payment is sent directly to your UK bank account. When you place your order, you'll need to provide your bank details (account name, sort code, and account number). All major UK banks are supported.",
        },
        {
          question: 'How long does payment take?',
          answer: "Most buyers pay within 1-3 working days of receiving and inspecting your device. Some offer same-day payment! The payment speed is shown on each buyer's offer so you know what to expect.",
        },
        {
          question: 'Is my payment guaranteed?',
          answer: "Your payment is guaranteed based on the condition of your device. If it matches your description, you'll receive the quoted price. If there's a discrepancy, the buyer will offer a revised price which you can accept or decline.",
        },
        {
          question: "What if I don't receive payment?",
          answer: "All our partner buyers are vetted and trusted. If you experience any issues with payment, contact us immediately with your order number and we'll help resolve it. That's why we recommend keeping your postage receipt until payment is confirmed.",
        },
      ],
    },
    {
      title: 'Security & Data',
      faqs: [
        {
          question: 'Is my personal data safe?',
          answer: 'Yes. All buyers securely wipe devices before processing, permanently erasing all personal data. However, we strongly recommend doing a factory reset yourself before sending, just to be safe. Your order information is protected and only shared with your chosen buyer.',
        },
        {
          question: 'What happens to my old phone?',
          answer: "Depending on condition, your phone will either be refurbished and resold, recycled for parts, or responsibly disposed of following UK environmental regulations. Nothing goes to landfill - it's all about sustainability!",
        },
        {
          question: 'Are the buyers trustworthy?',
          answer: 'All buyers on our platform are vetted UK companies with established track records. We display their Trustpilot ratings and reviews so you can make an informed choice. We only work with reputable, reliable recyclers.',
        },
        {
          question: 'Is my bank information secure?',
          answer: 'Your bank details are encrypted and transmitted securely. We use industry-standard security measures to protect your information. Bank details are only used to process your payment and are not stored longer than necessary.',
        },
      ],
    },
    {
      title: 'Problems & Returns',
      faqs: [
        {
          question: 'What if I change my mind?',
          answer: "If you haven't sent your device yet, simply don't use the shipping label - there's no obligation. If you've already sent it and the buyer hasn't processed it yet, contact them directly to request its return.",
        },
        {
          question: 'What if my phone gets lost in the post?',
          answer: "All shipments are tracked. If your device doesn't arrive, contact us with your tracking number and proof of postage. We'll work with Royal Mail and the buyer to resolve the issue. That's why keeping your receipt is important!",
        },
        {
          question: 'The buyer offered a lower price than quoted. What can I do?',
          answer: 'If the buyer\'s inspection finds issues not mentioned in your original description, they may offer a revised price. You can accept it, negotiate, or request your device back (return postage may apply). Always be accurate about condition to avoid surprises.',
        },
        {
          question: 'How do I contact customer support?',
          answer: 'You can reach us by email at support@recyclemydevice.co.uk, by phone at 0330 123 4567 (Mon-Fri 9am-6pm), or through our contact form. We aim to respond within 24 hours.',
        },
      ],
    },
  ];

  // Use backend data if available, otherwise fallback to empty
  const displayCategories = faqCategories.length > 0 ? faqCategories : mockCategories;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-white py-16 px-4 sm:px-6 lg:px-8 border-b">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about selling your phone with Recycle My Device.
          </p>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {displayCategories.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {category.title}
              </h2>
              <div className="space-y-3">
                {category.faqs.map((faq, faqIndex) => {
                  const indexKey = `${categoryIndex}-${faqIndex}`;
                  const isOpen = openIndex === indexKey;

                  return (
                    <div
                      key={faqIndex}
                      className="bg-white rounded-lg border border-gray-200 overflow-hidden"
                    >
                      <button
                        onClick={() => toggleFAQ(indexKey)}
                        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-base font-semibold text-gray-900 pr-4">
                          {faq.question}
                        </span>
                        <ChevronDown
                          className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform duration-200 ${
                            isOpen ? 'transform rotate-180' : ''
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-6 pb-4 pt-2">
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Still Have Questions CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-t">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageCircle className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Still Have Questions?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Can't find what you're looking for? We're always happy to help.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/contact"
              className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors shadow-md"
            >
              Contact Us
            </Link>
            <Link
              to="/sell-your-phone"
              className="inline-block bg-white text-primary border-2 border-primary px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
            >
              Start Selling
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
