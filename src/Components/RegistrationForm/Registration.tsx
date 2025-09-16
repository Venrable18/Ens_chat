import { useState, useEffect } from 'react';
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt
} from 'wagmi';
import { toast } from 'sonner';
import { registryAbi, tokenAbi } from '../../config/abi';

const REGISTRY_ADDRESS = '0x6E1B759148023E90414767F8c7C393eF0dE70a9C';
const TOKEN_ADDRESS = '0x25bbd618B34d2F56C51B7a5569F3c9D31ED869d0';
const REGISTRATION_FEE = BigInt(10e18); // 10 TST

export default function RegisterForm() {
  const { address, isConnected } = useAccount();
  const { writeContract: writeRegistry } = useWriteContract();
  const { writeContract: writeToken } = useWriteContract();

  const [name, setName] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [ipfsHash, setIpfsHash] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [allowance, setAllowance] = useState(BigInt(0));
  const [isApproved, setIsApproved] = useState(false);
  const [approveTxHash, setApproveTxHash] = useState(null);

  const { isSuccess: isApprovedTxSuccess } = useWaitForTransactionReceipt({
    hash: approveTxHash,
    query: { enabled: !!approveTxHash },
  });

  useEffect(() => {
    if (isApprovedTxSuccess) {
      toast.success('TST approved successfully');
      setIsApproved(true);
    }
  }, [isApprovedTxSuccess]);

  useEffect(() => {
    const fetchAllowance = async () => {
      if (!address) return;
      try {
        const result = await useReadContract({
          address: TOKEN_ADDRESS,
          abi: tokenAbi,
          functionName: 'allowance',
          args: [address, REGISTRY_ADDRESS],
        });
        setAllowance(BigInt(result));
        setIsApproved(BigInt(result) >= REGISTRATION_FEE);
      } catch (err) {
        console.error('Allowance check failed:', err);
      }
    };
    fetchAllowance();
  }, [address]);

  const handleApprove = async () => {
    try {
      const tx = await writeToken({
        address: TOKEN_ADDRESS,
        abi: tokenAbi,
        functionName: 'approve',
        args: [REGISTRY_ADDRESS, REGISTRATION_FEE],
        account: address,
      });
      toast.info('Approval transaction sent');
      setApproveTxHash(tx);
    } catch (err) {
      toast.error('Approval failed');
      console.error(err);
    }
  };

  const uploadToIPFS = async (file) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_JWT}`,
      },
      body: formData,
    });

    const data = await res.json();
    setIsUploading(false);
    return data.IpfsHash;
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file.size > 20 * 1024) {
      toast.error('File too large. Max size is 20KB');
      return;
    }
    setImageFile(file);
    const hash = await uploadToIPFS(file);
    setIpfsHash(hash);
    toast.success('Image uploaded successfully');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !ipfsHash || !isApproved) {
      toast.error('Complete all fields and approve TST first');
      return;
    }

    try {
      await writeRegistry({
        address: REGISTRY_ADDRESS,
        abi: registryAbi,
        functionName: 'register',
        args: [name, ipfsHash],
        account: address,
      });
      toast.success('Registration successful');
      setName('');
      setImageFile(null);
      setIpfsHash('');
    } catch (err) {
      toast.error('Registration failed');
      console.error(err);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-center">Register Your .cosmos Name</h2>
      {isConnected ? (
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Enter your .cosmos name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-4 py-2 border rounded-md"
            required
          />

          {!isApproved ? (
            <button
              type="button"
              onClick={handleApprove}
              className="w-full bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600"
            >
              Approve 10 TST
            </button>
          ) : (
            <button
              type="submit"
              disabled={isUploading}
              className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {isUploading ? 'Uploading...' : 'Register'}
            </button>
          )}
        </form>
      ) : (
        <p className="text-center text-gray-500">Please connect your wallet to register.</p>
      )}
    </div>
  );
}


