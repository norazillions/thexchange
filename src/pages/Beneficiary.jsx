import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase/firestore';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  deleteDoc,
  updateDoc,
  increment,
  getDoc
} from 'firebase/firestore';
import { motion } from 'motion/react';
import { 
  Users, 
  Plus, 
  User, 
  Building2, 
  CreditCard,
  Trash2,
  Search,
  X
} from 'lucide-react';
import { toast } from 'react-toastify';
import TheLoad from '../components/common/TheLoad';

const Beneficiary = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [beneficiaryCount, setBeneficiaryCount] = useState(0);

  // Fetch user data and beneficiaries
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        // First, get the user's beneficiary count
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        
        let count = 0;
        if (userSnap.exists()) {
          const userData = userSnap.data();
          count = userData.beneficiaryCount || 0;
          setBeneficiaryCount(count);
        }

        // Only fetch beneficiaries if count > 0
        if (count > 0) {
          const q = query(collection(db, 'users', user.uid, 'beneficiaries'));
          const querySnapshot = await getDocs(q);
          const beneficiaryData = [];
          querySnapshot.forEach((doc) => {
            beneficiaryData.push({
              id: doc.id,
              ...doc.data()
            });
          });
          setBeneficiaries(beneficiaryData);
        } else {
          // No beneficiaries, set empty array
          setBeneficiaries([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        // Don't show error toast if it's just that there are no beneficiaries
        if (error.code !== 'not-found') {
          toast.error('Failed to load beneficiaries');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Delete beneficiary
  const handleDelete = async (beneficiaryId) => {
    if (!user) return;
    if (!confirm('Are you sure you want to delete this beneficiary?')) return;

    setDeletingId(beneficiaryId);
    try {
      // Delete the beneficiary document from the subcollection
      await deleteDoc(doc(db, 'users', user.uid, 'beneficiaries', beneficiaryId));
      
      // Update the user's beneficiary count
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        beneficiaryCount: increment(-1)
      });
      
      // Update local state
      setBeneficiaries(prev => prev.filter(b => b.id !== beneficiaryId));
      setBeneficiaryCount(prev => prev - 1);
      toast.success('Beneficiary deleted successfully');
    } catch (error) {
      console.error('Error deleting beneficiary:', error);
      toast.error('Failed to delete beneficiary');
    } finally {
      setDeletingId(null);
    }
  };

  // Filter beneficiaries based on search
  const filteredBeneficiaries = beneficiaries.filter(beneficiary =>
    beneficiary.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    beneficiary.bank?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    beneficiary.accountNumber?.includes(searchTerm)
  );

  // Format date
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  if (loading) {
    return (
      <TheLoad/>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-6xl mx-auto px-4 sm:px-6 pb-20 lg:pb-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-semibold text-[#111111]">Beneficiaries</h1>
          {/* <p className="text-xs text-[#666666]">Manage your saved recipients</p> */}
        </div>
        <button
          onClick={() => navigate('/add-beneficiary')}
          className="flex items-center gap-2 bg-[#E91908] text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-[#cc1707] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Beneficiary
        </button>
      </div>

      {/* Search Bar - Only show if beneficiaries exist */}
      {beneficiaries.length > 0 && (
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#999999]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search beneficiaries..."
            className="w-full h-10 pl-10 pr-4 text-sm bg-white border border-[#E5E5E5] rounded-lg focus:border-[#E91908] focus:outline-none focus:ring-1 focus:ring-[#E91908] text-[#111111]"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#999999] hover:text-[#666666]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Content */}
      {beneficiaries.length === 0 ? (
        // Empty State
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-[#E5E5E5] rounded-lg p-8 text-center"
        >
          <div className="w-16 h-16 bg-[#F5F5F5] rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-[#999999]" />
          </div>
          <h3 className="text-base font-semibold text-[#111111] mb-2">No beneficiaries yet</h3>
          <p className="text-sm text-[#666666] max-w-sm mx-auto mb-4">
            Add your first beneficiary to start sending money quickly and easily.
          </p>
          <button
            onClick={() => navigate('/add-beneficiary')}
            className="inline-flex items-center gap-2 bg-[#E91908] text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-[#cc1707] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Beneficiary
          </button>
        </motion.div>
      ) : filteredBeneficiaries.length === 0 ? (
        // No search results
        <div className="bg-white border border-[#E5E5E5] rounded-lg p-8 text-center">
          <p className="text-sm text-[#666666]">No beneficiaries match your search</p>
          <button
            onClick={() => setSearchTerm('')}
            className="text-sm text-[#E91908] hover:underline mt-2"
          >
            Clear search
          </button>
        </div>
      ) : (
        // Beneficiary List
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-[#E5E5E5] rounded-lg overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F8F9FA] border-b border-[#E5E5E5]">
                <tr>
                  <th className="text-left text-xs font-medium text-[#666666] uppercase tracking-wider px-4 py-3">
                    Beneficiary
                  </th>
                  <th className="text-left text-xs font-medium text-[#666666] uppercase tracking-wider px-4 py-3 hidden sm:table-cell">
                    Bank / Account
                  </th>
                  <th className="text-left text-xs font-medium text-[#666666] uppercase tracking-wider px-4 py-3 hidden md:table-cell">
                    Added
                  </th>
                  <th className="text-right text-xs font-medium text-[#666666] uppercase tracking-wider px-4 py-3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredBeneficiaries.map((beneficiary, index) => (
                  <motion.tr
                    key={beneficiary.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-[#F0F0F0] hover:bg-[#F8F9FA] transition-colors last:border-0"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-[#E91908]/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-[#E91908]" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#111111]">{beneficiary.name}</p>
                          <p className="text-xs text-[#666666] sm:hidden">
                            {beneficiary.bank} • {beneficiary.accountNumber}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-3.5 h-3.5 text-[#666666]" />
                        <span className="text-sm text-[#111111]">{beneficiary.bank}</span>
                        <span className="text-xs text-[#666666]">•</span>
                        <span className="text-sm text-[#111111]">{beneficiary.accountNumber}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-sm text-[#666666]">{formatDate(beneficiary.createdAt)}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDelete(beneficiary.id)}
                        disabled={deletingId === beneficiary.id}
                        className="text-[#999999] hover:text-[#E91908] transition-colors disabled:opacity-50 disabled:cursor-not-allowed p-1"
                      >
                        {deletingId === beneficiary.id ? (
                          <div className="w-5 h-5 border-2 border-[#E91908] border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer with count */}
          <div className="px-4 py-3 bg-[#F8F9FA] border-t border-[#E5E5E5]">
            <p className="text-xs text-[#666666]">
              Showing {filteredBeneficiaries.length} of {beneficiaries.length} beneficiary{beneficiaries.length !== 1 ? 'ies' : ''}
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Beneficiary;