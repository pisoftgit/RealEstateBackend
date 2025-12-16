import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiEdit, FiTrash2, FiCheckCircle, FiX, FiUploadCloud, FiMapPin } from "react-icons/fi";
import axios from "axios";
import useBuilders from "../../../hooks/Realtor/useBuilders";
import useBusinessNatureActions from "../../../hooks/propertyConfig/BusinessNaturehook";
import useCountry from "../../../hooks/General/useCountry";
import useStateManagement from "../../../hooks/General/useStateManage";
import useDistrictManagement from "../../../hooks/General/useDistrictManage";
import { backendUrl } from "../../../ProtectedRoutes/api";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } },
};

// Reusable Realtor Form
const RealtorForm = ({ initialData, onSubmit, onClose }) => {
  const { businessNatures } = useBusinessNatureActions();
  const { countries } = useCountry();
  const { states, setSelectedCountryId } = useStateManagement();
  const { districts, setSelectedStateId } = useDistrictManagement();

  const [form, setForm] = useState({
    name: initialData.name || "",
    email: initialData.email || "",
    headOffice: initialData.headOffice || "",
    websiteURL: initialData.websiteURL || "",
    description: initialData.description || "",
    logoFile: null,
    logoURL: initialData.logoURL || null,
    businessNature: initialData.businessNature || [],
    addAddress: initialData.addAddress || false,
    address: initialData.address || {
      address1: "",
      address2: "",
      city: "",
      pincode: "",
      districtId: "",
      stateId: "",
      countryId: "",
    },
  });

  const [logoPreview, setLogoPreview] = useState(form.logoURL);

  const handleChange = (e) => {
    const { name, value, checked, files } = e.target;

    if (name === "logoFile") {
      const file = files[0];
      setForm((prev) => ({ ...prev, logoFile: file }));

      // Preview Image
      setLogoPreview(URL.createObjectURL(file));
      return;
    }

    if (name === "businessNature") {
      const updated = checked
        ? [...form.businessNature, value]
        : form.businessNature.filter((id) => id !== value);
      setForm((prev) => ({ ...prev, businessNature: updated }));
      return;
    }

    if (name === "addAddress") {
      setForm((prev) => ({ ...prev, addAddress: value === "Yes" }));
      return;
    }

    if (name.startsWith("address.")) {
      const key = name.split(".")[1];
      const newAddress = { ...form.address, [key]: value };

      // COUNTRY SELECTED → LOAD STATES
      if (key === "countryId") {
        setSelectedCountryId(value);
        newAddress.stateId = "";
        newAddress.districtId = "";
      }

      // STATE SELECTED → LOAD DISTRICTS
      if (key === "stateId") {
        setSelectedStateId(value);
        newAddress.districtId = "";
      }

      setForm((prev) => ({ ...prev, address: newAddress }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const convertFileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
    });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let base64Logo = "";
      if (form.logoFile) base64Logo = await convertFileToBase64(form.logoFile);

      const payload = {
        name: form.name,
        email: form.email,
        headOffice: form.headOffice,
        hasAddress: form.addAddress,
        websiteURL: form.websiteURL,
        description: form.description,
        logoContentType: form.logoFile ? form.logoFile.type : "",
        logoString: base64Logo,
        businessNatureIds: form.businessNature.map((x) => Number(x)),
        addedById: 1,
        ...(form.addAddress && {
          addressType: "Office",
          address1: form.address.address1,
          address2: form.address.address2,
          city: form.address.city,
          pincode: form.address.pincode,
          districtId: Number(form.address.districtId),
          stateId: Number(form.address.stateId),
          countryId: Number(form.address.countryId),
        }),
      };

      await onSubmit(payload);
    } catch (err) {
      console.error(err);
      alert("Failed to save Realtor");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl relative p-6 sm:p-10 border border-gray-300 dark:border-gray-700"
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
      >
        <FiX size={22} />
      </button>

      <h2 className="text-3xl font-bold text-blue-950 dark:text-white border-b-4 border-blue-600 pb-2 mb-6">
        <FiEdit className="inline mr-2 text-blue-600" /> Edit Realtor Partner
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
        {/* Business Nature */}
        <div>
          <label className="block font-bold mb-2">Business Nature *</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {businessNatures.map((bn) => (
              <label
                key={bn.id}
                className={`flex items-center p-4 border rounded-xl cursor-pointer ${
                  form.businessNature.includes(bn.id.toString())
                    ? "bg-blue-950 text-white"
                    : "bg-gray-100 dark:bg-gray-700"
                }`}
              >
                <input
                  type="checkbox"
                  name="businessNature"
                  value={bn.id}
                  checked={form.businessNature.includes(bn.id.toString())}
                  onChange={handleChange}
                  className="mr-3"
                />
                {bn.name}
              </label>
            ))}
          </div>
        </div>

        {/* Name */}
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          className="p-3 rounded-lg border dark:border-gray-600 w-full"
        />

        {/* email */}
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="p-3 rounded-lg border dark:border-gray-600 w-full"
        />

        {/* Head Office */}
        <input
          type="text"
          name="headOffice"
          value={form.headOffice}
          onChange={handleChange}
          placeholder="Head Office"
          className="p-3 rounded-lg border dark:border-gray-600 w-full"
        />

        {/* Website URL */}
        <input
          type="text"
          name="websiteURL"
          value={form.websiteURL}
          onChange={handleChange}
          placeholder="Website URL"
          className="p-3 rounded-lg border dark:border-gray-600 w-full"
        />

        {/* Description */}
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="p-3 border rounded-lg w-full"
          rows="3"
        />

        {/* Logo Upload */}
        <label className="flex p-4 border-2 border-dashed rounded-xl cursor-pointer bg-gray-100 dark:bg-gray-700">
          <FiUploadCloud className="text-blue-600 mr-3" />
          <span>{form.logoFile ? form.logoFile.name : "Choose Logo File"}</span>
          <input type="file" name="logoFile" accept="image/*" onChange={handleChange} className="hidden" />
        </label>
        {logoPreview && <img src={logoPreview} alt="Logo Preview" className="h-20 mt-3 rounded shadow" />}

        {/* Address Option */}
        <div>
          <label className="font-bold block mb-2">Include Address Details?</label>
          <div className="flex gap-6">
            <label>
              <input type="radio" name="addAddress" value="Yes" checked={form.addAddress} onChange={handleChange} /> Yes
            </label>
            <label>
              <input type="radio" name="addAddress" value="No" checked={!form.addAddress} onChange={handleChange} /> No
            </label>
          </div>
        </div>

        {/* Address Form */}
        <AnimatePresence>
          {form.addAddress && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-5 border rounded-xl bg-blue-50">
              <legend className="font-bold mb-4">
                <FiMapPin className="inline mr-2" /> Address Details
              </legend>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Country */}
                <select name="address.countryId" value={form.address.countryId} onChange={handleChange} className="p-3 border rounded-lg">
                  <option value="">Select Country</option>
                  {countries.map((c) => <option key={c.id} value={c.id}>{c.country}</option>)}
                </select>

                {/* State */}
                <select
                  name="address.stateId"
                  value={form.address.stateId}
                  onChange={handleChange}
                  disabled={!form.address.countryId}
                  className="p-3 border rounded-lg"
                >
                  <option value="">Select State</option>
                  {states.map((s) => <option key={s.id} value={s.id}>{s.state}</option>)}
                </select>

                {/* District */}
                <select
                  name="address.districtId"
                  value={form.address.districtId}
                  onChange={handleChange}
                  disabled={!form.address.stateId}
                  className="p-3 border rounded-lg"
                >
                  <option value="">Select District</option>
                  {districts.map((d) => <option key={d.id} value={d.id}>{d.district}</option>)}
                </select>

                <input name="address.address1" placeholder="Address Line 1" value={form.address.address1} onChange={handleChange} className="p-3 border rounded-lg" />
                <input name="address.address2" placeholder="Address Line 2" value={form.address.address2} onChange={handleChange} className="p-3 border rounded-lg" />
                <input name="address.city" placeholder="City" value={form.address.city} onChange={handleChange} className="p-3 border rounded-lg" />
                <input name="address.pincode" placeholder="Pincode" value={form.address.pincode} onChange={handleChange} className="p-3 border rounded-lg" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button type="submit" className="w-full py-4 rounded-xl bg-blue-950 text-white font-bold flex items-center justify-center">
          <FiCheckCircle className="inline mr-2" /> Save Changes
        </button>
      </form>
    </motion.div>
  );
};

const ManageBuilders = () => {
  const { builders: apiBuilders, loading, updateBuilder, deleteBuilder } = useBuilders();
  const [builders, setBuilders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBuilder, setCurrentBuilder] = useState(null);

  const fetchLogoUrl = async (builderId, contentType = "image/jpeg") => {
    try {
      const secretKey = localStorage.getItem("authToken");
      const res = await axios.get(`${backendUrl}/builders/getLogo/${builderId}/logo`, {
        headers: { secret_key: secretKey },
        responseType: "arraybuffer",
      });
      const blob = new Blob([res.data], { type: contentType });
      return URL.createObjectURL(blob);
    } catch (err) {
      console.error("Error fetching logo:", err.message);
      return null;
    }
  };

  useEffect(() => {
    const loadBuilders = async () => {
      const buildersWithLogo = await Promise.all(
        (apiBuilders || []).map(async (b) => ({
          ...b,
          businessNature: b.businessNatures?.map((x) => x.nature) || [],
          logoUrl: b.logoContentType ? await fetchLogoUrl(b.id, b.logoContentType) : null,
          address: b.hasAddress ? b.address || {} : {},
          usercode: b.addedById || "N/A",
        }))
      );
      setBuilders(buildersWithLogo);
    };

    loadBuilders();
  }, [apiBuilders]);

  const filteredBuilders = builders.filter((b) =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openEditModal = (builder) => {
    setCurrentBuilder({ ...builder, logoFile: null });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this builder?")) {
      await deleteBuilder(id);
    }
  };

  if (loading) return <div className="p-10 text-xl dark:text-white text-gray-800">Loading...</div>;

  return (
    <motion.div className="min-h-screen p-5 font-dm bg-gray-50 dark:bg-gray-900">
      <h1 className="text-3xl dark:text-gray-200 text-gray-800 font-semibold mb-4 ml-4">
        Manage Builder Partners ({builders.length})
      </h1>

      {/* Search Bar */}
      <div className="mb-4 ml-4">
        <input
          type="text"
          placeholder="Search by builder name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-3 rounded-lg border dark:border-gray-600 w-80"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow-lg rounded-xl">
        <table className="min-w-full bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr className="text-left text-gray-800 dark:text-gray-200 uppercase text-sm">
              <th className="p-4 border-b dark:border-gray-600">S/N</th>
              <th className="p-4 border-b dark:border-gray-600">Logo</th>
              <th className="p-4 border-b dark:border-gray-600">Name</th>
              <th className="p-4 border-b dark:border-gray-600">Email</th>
              <th className="p-4 border-b dark:border-gray-600">Usercode</th>
              <th className="p-4 border-b dark:border-gray-600">Business Nature</th>
              <th className="p-4 border-b dark:border-gray-600">Head Office</th>
              <th className="p-4 border-b dark:border-gray-600">Description</th>
              <th className="p-4 border-b dark:border-gray-600">Website URL</th>
              <th className="p-4 border-b dark:border-gray-600 text-center">Manage</th>
            </tr>
          </thead>

          <tbody>
            {filteredBuilders.map((b, index) => (
              <tr key={b.id} className="border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <td className="p-4">{index + 1}</td>
                <td className="p-4">
                  {b.logoUrl ? <img src={b.logoUrl} alt="Logo" className="w-12 h-12 object-cover rounded-md" /> : "No Logo"}
                </td>
                <td className="p-4">{b.name}</td>
                <td className="p-4">{b.email}</td>
                <td className="p-4">{b.usercode}</td>
                <td className="p-4">{b.businessNature.join(", ")}</td>
                <td className="p-4">{b.headOffice}</td>
                <td className="p-4">{b.websiteURL}</td>
                <td className="p-4">{b.description}</td>
                <td className="p-4 text-center">
                  <div className="flex justify-center gap-3">
                    <button onClick={() => openEditModal(b)} className="p-2 rounded-full text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-gray-600 transition">
                      <FiEdit size={18} />
                    </button>
                    <button onClick={() => handleDelete(b.id)} className="p-2 rounded-full text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-gray-600 transition">
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {isModalOpen && currentBuilder && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <RealtorForm
              initialData={currentBuilder}
              onSubmit={async (updatedData) => {
                await updateBuilder(currentBuilder.id, updatedData);
                setIsModalOpen(false);
                const updatedBuilders = builders.map((b) =>
                  b.id === currentBuilder.id ? { ...b, ...updatedData, businessNature: updatedData.businessNatureIds.map(String) } : b
                );
                setBuilders(updatedBuilders);
              }}
              onClose={() => setIsModalOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ManageBuilders;
