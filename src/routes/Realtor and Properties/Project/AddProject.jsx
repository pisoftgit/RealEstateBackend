import React, { useState, useEffect } from "react";
import { FiPlus, FiX } from "react-icons/fi";
import useReras from "../../../hooks/propertyConfig/useRera";
import usePlcs from "../../../hooks/propertyConfig/usePlcs";
import useCountry from "../../../hooks/General/useCountry";
import useStateManagement from "../../../hooks/General/useStateManage";
import useDistrictManagement from "../../../hooks/General/useDistrictManage";
import useMeasurementUnits from "../../../hooks/propertyConfig/useMeasurementUnits";
import axios from "axios";
import { backendUrl } from "../../../ProtectedRoutes/api";
import { toast, ToastContainer, Bounce } from "react-toastify";

const AddProject = () => {
  const [form, setForm] = useState({
    plc: [],
    builder: "",
    projectName: "",
    possessionStatus: "",
    startDate: "",
    completionDate: "",
    isGated: false,
    isReraApproved: false,
    reraNo: "",
    area: "",
    areaUnitId: "",
    description: "",
    country: "",
    state: "",
    district: "",
    city: "",
    address1: "",
    address2: "",
    pincode: "",
  });

  const [mediaFiles, setMediaFiles] = useState([{ id: 1, label: "", file: null }]);
  const [builders, setBuilders] = useState([]);
  const [possessionStatusOptions, setPossessionStatusOptions] = useState([]);

  const { reras } = useReras();
  const { plcs } = usePlcs();
  const { countries } = useCountry();
  const { states, setSelectedCountryId } = useStateManagement();
  const { districts, setSelectedStateId } = useDistrictManagement();
  const { units, loading: unitsLoading } = useMeasurementUnits();

  // Fetch builders
  useEffect(() => {
    const fetchBuilders = async () => {
      try {
        const secretKey = localStorage.getItem("authToken");
        const userData = JSON.parse(localStorage.getItem("userData"));
        const userId = userData?.user?.id;

        const res = await axios.get(`${backendUrl}/builders/getAllBuilders/${userId}`, {
          headers: { secret_key: secretKey },
        });

        setBuilders(
          res.data.map((b) => ({
            id: b.id,
            label: b.name || b.headOffice,
          }))
        );
      } catch (err) {
        console.error("Error fetching builders:", err);
      }
    };
    fetchBuilders();
  }, []);

  // Fetch possession status
  useEffect(() => {
    const fetchPossessionStatus = async () => {
      try {
        const secretKey = localStorage.getItem("authToken");

        const res = await axios.get(`${backendUrl}/real-estate-projects/getAllPossessionStatus`, {
          headers: { secret_key: secretKey },
        });

        setPossessionStatusOptions(
          res.data.map((s) => ({
            value: s,
            label:
              s === "READY_TO_MOVE"
                ? "Ready To Move"
                : s === "UNDER_CONSTRUCTION"
                ? "Under Construction"
                : s,
          }))
        );
      } catch (err) {
        console.error("Error fetching possession:", err);
      }
    };
    fetchPossessionStatus();
  }, []);

  // handle change
  const handleFormChange = (e) => {
    const { name, value, checked, type, options } = e.target;

    if (name === "plc") {
      let arr = [...form.plc];
      if (checked) arr.push(Number(value));
      else arr = arr.filter((id) => id !== Number(value));
      setForm((p) => ({ ...p, plc: arr }));
    } else if (name === "isGated" || name === "isReraApproved") {
      setForm((p) => ({ ...p, [name]: value === "Yes" }));
    } else if (name === "country") {
      setForm((p) => ({ ...p, country: Number(value) }));
      setSelectedCountryId(Number(value));
    } else if (name === "state") {
      setForm((p) => ({ ...p, state: Number(value) }));
      setSelectedStateId(Number(value));
    } else if (name === "district") {
      setForm((p) => ({ ...p, district: Number(value) }));
    } else {
      setForm((p) => ({ ...p, [name]: value }));
    }
  };

  const handleMediaChange = (id, field, value) => {
    setMediaFiles((prev) => prev.map((m) => (m.id === id ? { ...m, [field]: value } : m)));
  };

  const addMediaFile = () =>
    setMediaFiles((prev) => [...prev, { id: Date.now(), label: "", file: null }]);

  const removeMediaFile = (id) =>
    setMediaFiles((prev) => prev.filter((m) => m.id !== id));

  // File → Base64 converter
  const convertToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (err) => reject(err);
    });

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      const addedById = userData?.user?.id;
      const secretKey = localStorage.getItem("authToken");

      // Convert all media files into Base64
      const convertedMedia = await Promise.all(
        mediaFiles.map(async (m) => {
          let base64 = "";
          let type = "image/png";

          if (m.file) {
            base64 = await convertToBase64(m.file);
            type = m.file.type;
          }

          return {
            mediaLabel: m.label,
            mediaBase64: base64,
            contentType: type,
          };
        })
      );

      const payload = {
        builderId: Number(form.builder),
        projectName: form.projectName,
        isGated: form.isGated,
        isReraApproved: form.isReraApproved,
        reraId: form.isReraApproved ? Number(form.rera) : null,
        reraNumber: form.isReraApproved ? form.reraNo : null,
        possessionStatus: form.possessionStatus,
        projectStartDate: form.startDate || null,
        projectCompletionDate: form.completionDate || null,
        addedById: addedById,
        reraNo: form.reraNo ||null,
        totalArea: Number(form.area),
        areaUnitId: Number(form.areaUnitId),
        description: form.description,
        address1: form.address1,
        address2: form.address2,
        city: form.city,
        pincode: form.pincode || "000000",
        districtId: form.district,
        stateId: form.state,
        countryId: form.country,
        currentDayDate: new Date().toISOString().split("T")[0],
        plcIds: form.plc,
        mediaDTOs: convertedMedia,
      };

      console.log("FINAL PAYLOAD:", payload);

      await axios.post(`${backendUrl}/real-estate-projects/saveProject`, payload, {
        headers: { secret_key: secretKey },
      });

      toast.success("Project Added Successfully!");

    } catch (err) {
      console.error("Submit Error:", err);
      toast.error("Error submitting project!");
    }
  };

  const inputClasses =
    "mt-1 w-full border border-gray-300 dark:border-gray-700 p-3 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white";

  const labelClasses = "font-semibold text-gray-700 dark:text-gray-300 mb-1 block";

  return (
    <div className="min-h-screen p-5 bg-gray-50 dark:bg-gray-900 font-dm">
     <div className="flex justify-between items-center mb-2">
        <h1 className="ml-4 text-2xl font-bold text-blue-950 dark:text-white">
          Add Project
        </h1>
      </div>
      <form
        onSubmit={handleSubmit}
        className="space-y-8 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl"
      >
        {/* Project Name */}
        <div>
          <label className={labelClasses}>Project Name *</label>
          <input
            type="text"
            name="projectName"
            value={form.projectName}
            onChange={handleFormChange}
            className={inputClasses}
            required
          />
        </div>

        {/* Builder */}
        <div>
          <label className={labelClasses}>Builder *</label>
          <select
            name="builder"
            value={form.builder}
            onChange={handleFormChange}
            className={inputClasses}
          >
            <option value="">--- Select Builder ---</option>
            {builders.map((b) => (
              <option key={b.id} value={b.id}>
                {b.label}
              </option>
            ))}
          </select>
        </div>

        {/* PLC */}
        <div>
          <label className={labelClasses}>PLCs</label>
          <div className="flex flex-wrap gap-3">
            {plcs.map((p) => (
              <label key={p.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="plc"
                  value={p.id}
                  checked={form.plc.includes(p.id)}
                  onChange={handleFormChange}
                />
                {p.name}
              </label>
            ))}
          </div>
        </div>

        {/* Possession Status */}
        <div>
          <label className={labelClasses}>Possession Status</label>
          <select
            name="possessionStatus"
            value={form.possessionStatus}
            onChange={handleFormChange}
            className={inputClasses}
          >
            <option value="">--- Select Status ---</option>
            {possessionStatusOptions.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClasses}>RERA no. *</label>
          <input
            type="text"
            name="reraNo"
            value={form.reraNo}
            onChange={handleFormChange}
            className={inputClasses}
            required
          />
        </div>

        {/* Area + Units */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className={labelClasses}>Total Area *</label>
            <input
              type="number"
              name="area"
              value={form.area}
              onChange={handleFormChange}
              className={inputClasses}
            />
          </div>
          <div>
            <label className={labelClasses}>Area Unit *</label>
            <select
              name="areaUnitId"
              value={form.areaUnitId}
              onChange={handleFormChange}
              className={inputClasses}
            >
              <option value="">--- Select Unit ---</option>
              {!unitsLoading &&
                units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.unitName}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Country → State → District */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className={labelClasses}>Country</label>
            <select
              name="country"
              value={form.country}
              onChange={handleFormChange}
              className={inputClasses}
            >
              <option value="">--- Select Country ---</option>
              {countries.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.country}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClasses}>State</label>
            <select
              name="state"
              value={form.state}
              onChange={handleFormChange}
              className={inputClasses}
            >
              <option value="">--- Select State ---</option>
              {states.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.state}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClasses}>District</label>
            <select
              name="district"
              value={form.district}
              onChange={handleFormChange}
              className={inputClasses}
            >
              <option value="">--- Select District ---</option>
              {districts.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.district}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClasses}>City</label>
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleFormChange}
              className={inputClasses}
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <label className={labelClasses}>Address Line 1</label>
          <input
            type="text"
            name="address1"
            value={form.address1}
            onChange={handleFormChange}
            className={inputClasses}
          />
        </div>

        <div>
          <label className={labelClasses}>Address Line 2</label>
          <input
            type="text"
            name="address2"
            value={form.address2}
            onChange={handleFormChange}
            className={inputClasses}
          />
        </div>

        <div>
          <label className={labelClasses}>Pincode</label>
          <input
            type="text"
            name="pincode"
            value={form.pincode}
            onChange={handleFormChange}
            className={inputClasses}
          />
        </div>

        {/* Description */}
        <div>
          <label className={labelClasses}>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleFormChange}
            className={inputClasses}
          ></textarea>
        </div>

        {/* MEDIA UPLOAD */}
        <div>
          <label className={labelClasses}>Media Files</label>
          {mediaFiles.map((m) => (
            <div key={m.id} className="flex items-center gap-3 mb-3">
              <input
                type="text"
                placeholder="Media Label"
                value={m.label}
                onChange={(e) => handleMediaChange(m.id, "label", e.target.value)}
                className="border p-2 rounded w-1/3"
              />

              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleMediaChange(m.id, "file", e.target.files[0])}
              />

              <button type="button" onClick={() => removeMediaFile(m.id)} className="text-red-500">
                <FiX size={20} />
              </button>
            </div>
          ))}

          <button type="button" onClick={addMediaFile} className="text-blue-600 flex items-center gap-2">
            <FiPlus /> Add Media
          </button>
        </div>

        {/* SUBMIT */}
        <button type="submit" className="w-full p-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800">
          Submit Project
        </button>
      </form>

      <ToastContainer position="top-center" transition={Bounce} />
    </div>
  );
};

export default AddProject;
