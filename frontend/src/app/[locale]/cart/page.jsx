
"use client";

import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import Image from "next/image";

import useCartData from "../hooks/useCartData.js";
import  useCheckoutLogic  from "../hooks/useCheckoutLogic.js";
import Spinner from "../components/Spinner.jsx";

const CartPage = () => {
  const t = useTranslations("cart");
  const locale = useLocale();
  const router = useRouter();

  // 1.  Cart Data Hook
  const {
    user,
    cart,
    total,
    loading,
    handleQuantity,
    handleRemove,
    getSafeImage,
    promoCode,
    setPromoCode,
    appliedPromo,
    promoDiscount,
    applyPromo,
    removePromo,
  } = useCartData();

  // 2.  Checkout Logic Hook
  const {
    isModalOpen,
    setIsModalOpen,
    isProcessing,
    address,
    setAddress,
    phone,
    setPhone,
    handleCheckout,
    handleCODCheckout,
    handleStripeCheckout,
  } = useCheckoutLogic(user, cart, total, appliedPromo, promoDiscount);

  const handleContinue = () => router.push(`/${locale}/products`);

  // --- Loading / Empty States ---
  if (loading)
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Spinner size={50} color="#a28533" />
      </div>
    );

  if (!cart.length)
    return (
      <div className="w-full py-20 text-center text-gray-500 dark:text-gray-300">
        <p className="text-lg mb-4">{t("emptyCart")}</p>
        <button onClick={handleContinue} className="px-5 py-2 bg-[#a28533] text-white rounded-lg hover:bg-[#8e7328]">
          {t("shopNow")}
        </button>
      </div>
    );

  // --- Render Cart ---
  return (
    <section className="py-14 px-4 sm:px-8">
      <h2 className="text-3xl font-bold text-center text-[#a28533] dark:text-amber-400 mb-8">{t("title")}</h2>

      {/*  Cart Table - Large Screens */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 dark:bg-MegaDark2 text-sm">
              <th className="py-3 px-4">{t("product")}</th>
              <th className="py-3 px-4">{t("price")}</th>
              <th className="py-3 px-4">{t("quantity")}</th>
              <th className="py-3 px-4">{t("subtotal")}</th>
              <th className="py-3 px-4">{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => {
              const discount = Number(item.discount) || 0;
              const hasDiscount = discount > 0;
              const discountedPrice = item.discountPrice; // Use pre-calculated price

              return (
                <tr key={item._id || item.productId} className="border-b dark:border-MegaDark2">
                  <td className="py-4 px-4 flex items-center gap-4">
                    <div className="relative w-20 h-20">
                      <Image src={getSafeImage(item.image)} alt={item.name?.[locale] || item.name} fill className="object-contain rounded-lg" />
                    </div>
                    <span className="font-medium">{item.name?.[locale] || item.name}</span>
                  </td>
                  <td className="py-4 px-4">
                    {hasDiscount ? (
                      <div>
                        <span className="text-red-500 font-semibold">{discountedPrice.toFixed(2)} LE</span>
                        <span className="line-through text-gray-400 text-sm ml-2">{item.price.toFixed(2)} LE</span>
                        <span className="ml-1 text-sm text-green-600">({discount}% OFF)</span>
                      </div>
                    ) : (
                      <span className="font-semibold">{item.price.toFixed(2)} LE</span>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleQuantity(item.productId, -1)} className="px-2 py-1 bg-gray-200 dark:bg-MegaDark2 rounded">−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => handleQuantity(item.productId, 1)} className="px-2 py-1 bg-gray-200 dark:bg-MegaDark2 rounded">+</button>
                    </div>
                  </td>
                  <td className="py-4 px-4">{(discountedPrice * item.quantity).toFixed(2)} LE</td>
                  <td className="py-4 px-4">
                    <button onClick={() => handleRemove(item.productId)} className="text-red-500 hover:text-red-600">
                      {t("remove")}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/*  Cart List - Small Screens */}
      <div className="md:hidden space-y-4">
        {cart.map((item) => {
          const discount = Number(item.discount) || 0;
          const hasDiscount = discount > 0;
          const discountedPrice = item.discountPrice; // Use pre-calculated price

          return (
            <div key={item._id || item.productId} className="flex border dark:border-MegaDark2 p-4 rounded-lg shadow-sm">
              <div className="relative w-20 h-20 flex-shrink-0 mr-4">
                <Image src={getSafeImage(item.image)} alt={item.name?.[locale] || item.name} fill className="object-contain rounded-lg" />
              </div>
              <div className="flex-grow">
                <p className="font-semibold mb-1">{item.name?.[locale] || item.name}</p>
                {/* Price */}
                <div className="text-sm mb-2">
                  {t("price")}:{" "}
                  {hasDiscount ? (
                    <div>
                      <span className="text-red-500 font-bold">{discountedPrice.toFixed(2)} LE</span>
                      <span className="line-through text-gray-400 ml-2">{item.price.toFixed(2)} LE</span>
                    </div>
                  ) : (
                    <span className="font-bold">{item.price.toFixed(2)} LE</span>
                  )}
                </div>

                {/* Quantity Control and Subtotal */}
                <div className="flex justify-between items-center mt-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleQuantity(item.productId, -1)} className="px-2 py-1 bg-gray-200 dark:bg-MegaDark2 rounded text-lg font-bold w-8 h-8 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-700 transition">−</button>
                    <span className="px-2 font-medium">{item.quantity}</span>
                    <button onClick={() => handleQuantity(item.productId, 1)} className="px-2 py-1 bg-gray-200 dark:bg-MegaDark2 rounded text-lg font-bold w-8 h-8 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-700 transition">+</button>
                  </div>
                  <p className="font-bold text-lg text-[#a28533] dark:text-amber-400">
                    {(discountedPrice * item.quantity).toFixed(2)} LE
                  </p>
                </div>

                {/* Remove Button */}
                <div className="mt-3 text-right">
                  <button onClick={() => handleRemove(item.productId)} className="text-red-500 text-sm hover:text-red-600">
                    {t("remove")}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/*  Promo Code Section */}
      <div className="flex items-center gap-2 mt-3">
        <input
          type="text"
          placeholder={t("enterPromo")}
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
          disabled={!!appliedPromo}
          className="max-w-80 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 flex-1 bg-transparent focus:ring-2 focus:ring-[#a28533] disabled:opacity-70"
        />
        {!appliedPromo ? (
          <button
            onClick={() => applyPromo(t)}
            className="bg-[#a28533] text-white px-4 py-2 rounded-lg hover:bg-[#8e7328] transition"
          >
            {t("apply")}
          </button>
        ) : (
          <button
            onClick={() => removePromo(t)}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            {t("remove")}
          </button>
        )}
      </div>

      {/*  Applied Promo Info */}
      {appliedPromo && (
        <p className="mt-2 text-sm text-green-600 dark:text-green-400">
          ✅ {t("promoActive", { code: appliedPromo.code, percent: appliedPromo.discount })}
        </p>
      )}

      {/* ✅ Total + Checkout */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-10 border-t pt-6 gap-4">
        <div className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
          {t("total")}:{" "}
          {appliedPromo ? (
            <span>
              <span className="line-through text-gray-400 mr-2">
                {(
                  total /
                  (1 - promoDiscount / 100)
                ).toFixed(2)}{" "}
                LE
              </span>
              <span className="text-[#a28533] dark:text-amber-400">
                {total.toFixed(2)} LE
              </span>
            </span>
          ) : (
            <span className="text-[#a28533] dark:text-amber-400">
              {total.toFixed(2)} LE
            </span>
          )}
        </div>

        <button
          onClick={() => handleCheckout(t)}
          disabled={!user?._id || isProcessing}
          className="px-6 py-2 bg-[#a28533] text-white rounded-lg hover:bg-[#8e7328] disabled:opacity-50"
        >
          {t("checkout")}
        </button>
      </div>


      {/*  Checkout Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-3">
          <div className="bg-white dark:bg-MegaDark2 rounded-2xl p-6 w-full max-w-[500px] shadow-lg overflow-y-auto max-h-[90vh]">
            <h3 className="text-xl font-bold mb-4 text-center">{t("confirmOrder")}</h3>
            <div className="space-y-3 mb-4">
              {["street", "city", "state", "country", "postalCode"].map((field) => (
                <div key={field}>
                  <label className="block mb-1 text-sm text-gray-600 dark:text-gray-300">{t(field)}</label>
                  <input
                    type="text"
                    value={address[field] || ""}
                    onChange={(e) => setAddress({ ...address, [field]: e.target.value })}
                    placeholder={t(`enter_${field}`)}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-transparent focus:ring-2 focus:ring-[#a28533]"
                  />
                </div>
              ))}
              <div>
                <label className="block mb-1 text-sm text-gray-600 dark:text-gray-300">{t("phone")}</label>
                <input
                  type="text"
                  value={phone || ""}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t("enterPhone")}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-transparent focus:ring-2 focus:ring-[#a28533]"
                />
              </div>
            </div>

            {/* Modal Total Display */}
            <div className="text-center mb-4 border-t pt-3">
              <span className="text-xl font-bold text-[#a28533] dark:text-amber-400">
                {t("total")}: {total.toFixed(2)} LE
              </span>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleStripeCheckout}
                disabled={isProcessing}
                className="py-3 rounded-lg bg-[#a28533] text-white font-semibold hover:bg-[#8e7328] transition disabled:opacity-70 w-full"
              >
                {isProcessing ? "Processing..." : "💳 Pay with Credit Card"}
              </button>

              <button
                onClick={handleCODCheckout}
                disabled={isProcessing}
                className="py-3 rounded-lg bg-gray-200 dark:bg-MegaDark hover:bg-gray-300 dark:hover:bg-[#1c2a66] text-gray-800 dark:text-white font-semibold transition w-full disabled:opacity-70"
              >
                🚚 Pay on Delivery
              </button>

              <button onClick={() => setIsModalOpen(false)} disabled={isProcessing} className="mt-2 text-sm text-gray-500 w-full disabled:opacity-70">
                {t("cancel")}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CartPage;