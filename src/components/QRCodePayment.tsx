import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle, AlertCircle, QrCode, Smartphone } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import { formatPrice } from '../lib/utils';

interface QRCodePaymentProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  onPaymentSuccess?: () => void;
}

export default function QRCodePayment({ isOpen, onClose, totalAmount, onPaymentSuccess }: QRCodePaymentProps) {
  const [selectedMethod, setSelectedMethod] = useState<'wave' | 'orange' | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const { showSuccess, showError } = useNotification();

  // URLs des QR codes (à remplacer par vos vraies images)
  const waveQRCode = "/images/wave-qr.png";  // Placez votre image Wave dans public/images/
  const orangeQRCode = "/images/orange-money-qr.png";  // Placez votre image Orange Money dans public/images/

  const paymentMethods = [
    {
      id: 'wave',
      name: 'Wave',
      icon: '🌊',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
      textColor: 'text-blue-400',
      description: 'Paiement mobile instantané',
      qrCode: waveQRCode
    },
    {
      id: 'orange',
      name: 'Orange Money',
      icon: '🍊',
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/30',
      textColor: 'text-orange-400',
      description: 'Paiement par Orange Money',
      qrCode: orangeQRCode
    }
  ];

  const handleMethodSelect = (methodId: 'wave' | 'orange') => {
    setSelectedMethod(methodId);
    setIsConfirmed(false);
  };

  const handleConfirmPayment = () => {
    if (!selectedMethod) {
      showError('Veuillez sélectionner un moyen de paiement');
      return;
    }
    setIsConfirmed(true);
    showSuccess(`💳 QR Code ${selectedMethod === 'wave' ? 'Wave' : 'Orange Money'} affiché. Scannez pour payer!`);
  };

  const handlePaymentDone = () => {
    showSuccess(`✅ Paiement de ${formatPrice(totalAmount)} effectué avec ${selectedMethod === 'wave' ? 'Wave' : 'Orange Money'}!`);
    if (onPaymentSuccess) {
      onPaymentSuccess();
    }
    onClose();
    setSelectedMethod(null);
    setIsConfirmed(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="glass rounded-[40px] max-w-2xl w-full max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 bg-primary/95 backdrop-blur-xl p-8 border-b border-white/10">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center">
                      <QrCode size={24} className="text-accent-cyan" />
                    </div>
                    <h2 className="text-2xl font-black">Paiement par QR Code</h2>
                  </div>
                  <p className="text-text-silver/40 text-sm">
                    Scannez le code QR avec votre application mobile pour payer
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 glass rounded-xl flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-8 space-y-6">
              {/* Montant à payer */}
              <div className="glass rounded-2xl p-6 text-center">
                <p className="text-text-silver/40 text-sm mb-2">Montant à payer</p>
                <p className="text-4xl font-black text-gradient">{formatPrice(totalAmount)}</p>
                <p className="text-text-silver/30 text-xs mt-2">FCFA</p>
              </div>

              {/* Méthodes de paiement */}
              {!selectedMethod ? (
                <>
                  <h3 className="text-sm font-black uppercase tracking-widest text-accent-cyan">
                    Choisissez votre moyen de paiement
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {paymentMethods.map((method) => (
                      <motion.button
                        key={method.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleMethodSelect(method.id as 'wave' | 'orange')}
                        className={`p-6 glass rounded-2xl border-2 transition-all ${
                          selectedMethod === method.id
                            ? `${method.borderColor} glow-${method.id === 'wave' ? 'blue' : 'orange'}`
                            : 'border-white/5 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-16 h-16 rounded-2xl ${method.bgColor} flex items-center justify-center text-3xl`}>
                            {method.icon}
                          </div>
                          <div className="text-left">
                            <h3 className="font-black text-lg">{method.name}</h3>
                            <p className="text-text-silver/40 text-xs">{method.description}</p>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  {/* Affichage du QR Code */}
                  <div className="text-center space-y-6">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => {
                          setSelectedMethod(null);
                          setIsConfirmed(false);
                        }}
                        className="text-text-silver/40 hover:text-white text-sm flex items-center gap-2 transition-colors"
                      >
                        ← Retour
                      </button>
                      <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                        selectedMethod === 'wave' ? 'bg-blue-500/20 text-blue-400' : 'bg-orange-500/20 text-orange-400'
                      }`}>
                        {selectedMethod === 'wave' ? 'Wave' : 'Orange Money'}
                      </div>
                    </div>

                    {!isConfirmed ? (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                      >
                        <div className="glass rounded-2xl p-8 text-center">
                          <Smartphone size={48} className="mx-auto text-text-silver/40 mb-4" />
                          <h3 className="text-xl font-black mb-2">Prêt à payer ?</h3>
                          <p className="text-text-silver/40 text-sm mb-6">
                            Cliquez sur "Afficher le QR Code" pour voir le code à scanner
                          </p>
                          <button
                            onClick={handleConfirmPayment}
                            className="btn-primary w-full py-4 flex items-center justify-center gap-3"
                          >
                            <QrCode size={20} />
                            Afficher le QR Code
                          </button>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-6"
                      >
                        <div className="glass rounded-2xl p-8 text-center">
                          <div className="bg-white rounded-2xl p-4 mb-4 inline-block">
                            <img
                              src={selectedMethod === 'wave' ? waveQRCode : orangeQRCode}
                              alt={`QR Code ${selectedMethod === 'wave' ? 'Wave' : 'Orange Money'}`}
                              className="w-64 h-64 object-contain"
                              onError={(e) => {
                                // Fallback si l'image n'existe pas
                                (e.target as HTMLImageElement).src = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=Paiement%20OpenTech%20Business%20${formatPrice(totalAmount)}%20FCFA`;
                              }}
                            />
                          </div>
                          <h3 className="font-black text-lg mb-2">Scannez ce code QR</h3>
                          <p className="text-text-silver/40 text-sm mb-4">
                            Ouvrez {selectedMethod === 'wave' ? 'Wave' : 'Orange Money'} et scannez ce code pour payer {formatPrice(totalAmount)}
                          </p>
                          <div className="flex gap-3">
                            <button
                              onClick={handlePaymentDone}
                              className="flex-1 bg-accent-green/20 text-accent-green py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-accent-green/30 transition-all"
                            >
                              <CheckCircle size={18} />
                              J'ai payé
                            </button>
                            <button
                              onClick={() => setIsConfirmed(false)}
                              className="flex-1 glass py-3 rounded-xl font-bold hover:bg-white/10 transition-all"
                            >
                              Revenir
                            </button>
                          </div>
                        </div>

                        {/* Instructions */}
                        <div className="glass rounded-2xl p-4">
                          <div className="flex items-start gap-3">
                            <AlertCircle size={18} className="text-accent-orange shrink-0 mt-0.5" />
                            <div>
                              <p className="text-xs font-bold uppercase tracking-widest text-accent-orange mb-1">
                                Instructions
                              </p>
                              <p className="text-xs text-text-silver/60">
                                1. Ouvrez {selectedMethod === 'wave' ? 'Wave' : 'Orange Money'} sur votre téléphone<br/>
                                2. Cliquez sur "Scanner" ou "Payer par QR Code"<br/>
                                3. Scannez le code QR ci-dessus<br/>
                                4. Confirmez le paiement de {formatPrice(totalAmount)}<br/>
                                5. Cliquez sur "J'ai payé" pour valider votre commande
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}