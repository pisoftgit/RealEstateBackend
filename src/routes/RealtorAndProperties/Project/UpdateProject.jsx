import React, { useState, useEffect } from "react";
import { FiPlus, FiX } from "react-icons/fi";
import { useParams } from "react-router-dom";
import useReras from "../../../hooks/propertyConfig/useRera";
import usePlcs from "../../../hooks/propertyConfig/usePlcs";
import useCountry from "../../../hooks/General/useCountry";
import useStateManagement from "../../../hooks/General/useStateManage";
import useDistrictManagement from "../../../hooks/General/useDistrictManage";
import useMeasurementUnits from "../../../hooks/propertyConfig/useMeasurementUnits";
import axios from "axios";
import { backendUrl } from "../../../ProtectedRoutes/api";

const UpdateProject = () => {
  const { projectId } = useParams();

  const [form, setForm] = useState({
    plc: [],
    builderId: "",
    projectName: "",
    possessionStatus: "",
    startDate: "",
    completionDate: "",
    isGated: false,
    isReraApproved: false,
    rera: "",
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

  const [mediaFiles, setMediaFiles] = useState([]);
  const [builders, setBuilders] = useState([]);
  const [possessionStatusOptions, setPossessionStatusOptions] = useState([]);

  const { reras } = useReras();
  const { plcs } = usePlcs();
  const { countries } = useCountry();
  const { states, setSelectedCountryId } = useStateManagement();
  const { districts, setSelectedStateId } = useDistrictManagement();
  const { units } = useMeasurementUnits();

  // Fetch project details
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const secretKey = localStorage.getItem("authToken");
        const res = await axios.get(
          `${backendUrl}/real-estate-projects/getProjectById/${projectId}`,
          { headers: { secret_key: secretKey } }
        );
        const data = res.data;

        setForm({
          plc: data.plcs?.map(p => p.id) || [],
          builderId: data.builderId || "",
          projectName: data.projectName || "",
          possessionStatus: data.possessionStatusEnum || "",
          startDate: data.projectStartDate || "",
          completionDate: data.projectCompletionDate || "",
          isReraApproved: data.isReraApproved || false,
          rera: data.reraId || "",
          reraNo: data.reraNumber || "",
          area: data.totalArea || "",
          areaUnitId: data.areaUnitId || "",
          description: data.description || "",
          country: data.countryId || "",
          state: data.stateId || "",
          district: data.districtId || "",
          city: data.city || "",
          address1: data.address1 || "",
          address2: data.address2 || "",
          pincode: data.pincode || "",
        });

        if (data.countryId) setSelectedCountryId(data.countryId);
        if (data.stateId) setSelectedStateId(data.stateId);
      } catch (err) {
        console.error("Error fetching project:", err?.response?.data || err.message);
      }
    };

    fetchProject();
  }, [projectId, setSelectedCountryId, setSelectedStateId]);

  // Fetch project media separately
  useEffect(() => {
    const fetchProjectMedia = async () => {
      try {
        const secretKey = localStorage.getItem("authToken");
        const res = await axios.get(
          `${backendUrl}/real-estate-projects/getProjectMediaByProjectId/${projectId}`,
          { headers: { secret_key: secretKey } }
        );

        const mediaData = res.data || [];
        setMediaFiles(
          mediaData.map(m => ({
            id: m.id,
            mediaLabel: m.mediaLabel || "",
            mediaURL: m.mediaURL || "",
            file: null,
            contentType: m.contentType || "image/png",
            isExisting: true,
          }))
        );
      } catch (err) {
        console.error("Error fetching project media:", err?.response?.data || err.message);
      }
    };

    if (projectId) fetchProjectMedia();
  }, [projectId]);

  // Fetch builders
  useEffect(() => {
    const fetchBuilders = async () => {
      try {
        const secretKey = localStorage.getItem("authToken");
        const userData = JSON.parse(localStorage.getItem("userData"));
        const userId = userData?.user?.id;

        const res = await axios.get(
          `${backendUrl}/builders/getAllBuilders/${userId}`,
          { headers: { secret_key: secretKey } }
        );

        const allNames = res.data
          .filter(b => b.id)
          .map(b => ({ id: b.id, label: b.name || b.headOffice }));

        setBuilders(allNames);
      } catch (err) {
        console.error("Error fetching builders:", err?.response?.data || err.message);
      }
    };

    fetchBuilders();
  }, []);

  // Fetch possession status
  useEffect(() => {
    const fetchPossessionStatus = async () => {
      try {
        const secretKey = localStorage.getItem("authToken");
        const res = await axios.get(
          `${backendUrl}/real-estate-projects/getAllPossessionStatus`,
          { headers: { secret_key: secretKey } }
        );

        const statusOptions = (res.data || []).map(s => ({
          value: s,
          label:
            s === "READY_TO_MOVE"
              ? "Ready to Move"
              : s === "UNDER_CONSTRUCTION"
              ? "Under Construction"
              : s,
        }));

        setPossessionStatusOptions(statusOptions);
      } catch (err) {
        console.error("Error fetching possession statuses:", err?.response?.data || err.message);
      }
    };

    fetchPossessionStatus();
  }, []);

  // Handle form changes
  const handleFormChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === "isGated" || name === "isReraApproved") {
      setForm(prev => ({ ...prev, [name]: checked }));
    } else if (["country", "state", "district", "areaUnitId", "builderId", "rera"].includes(name)) {
      setForm(prev => ({ ...prev, [name]: Number(value) }));
      if (name === "country") setSelectedCountryId(Number(value));
      if (name === "state") setSelectedStateId(Number(value));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  // PLC handler
  const handlePlcChange = (id) => {
    setForm(prev => ({
      ...prev,
      plc: prev.plc.includes(id) ? prev.plc.filter(p => p !== id) : [...prev.plc, id],
    }));
  };

  // Media handlers
  const handleMediaChange = (id, field, value) => {
    if (field === "file" && value) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaFiles(prev =>
          prev.map(m =>
            m.id === id
              ? { ...m, file: value, mediaBase64: reader.result.split(",")[1], mediaURL: "" }
              : m
          )
        );
      };
      reader.readAsDataURL(value);
    } else {
      setMediaFiles(prev => prev.map(m => (m.id === id ? { ...m, [field]: value } : m)));
    }
  };

  const addMediaFile = () => {
    setMediaFiles(prev => [
      ...prev,
      { id: Date.now(), mediaLabel: "", file: null, contentType: "image/png" },
    ]);
  };

  const removeMediaFile = async (id) => {
    try {
      const secretKey = localStorage.getItem("authToken");

      // Delete existing media via API
      await axios.delete(
        `${backendUrl}/property-media/deletePropertyMediaById/${id}`,
        { headers: { secret_key: secretKey } }
      );

      setMediaFiles(prev => prev.filter(m => m.id !== id));
      alert("Media deleted successfully!");
    } catch (err) {
      console.error("Error deleting media:", err?.response?.data || err.message);
      alert("Failed to delete media.");
    }
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      const addedById = userData?.user?.id;

      const payload = {
        builderId: Number(form.builderId),
        projectName: form.projectName,
        isGated: form.isGated,
        isReraApproved: form.isReraApproved,
        reraId: form.isReraApproved ? Number(form.rera) : null,
        reraNumber: form.isReraApproved ? form.reraNo : null,
        possessionStatus: form.possessionStatus,
        projectStartDate: form.startDate,
        projectCompletionDate: form.completionDate,
        addedById,
        totalArea: Number(form.area),
        areaUnitId: Number(form.areaUnitId),
        description: form.description,
        address1: form.address1,
        address2: form.address2,
        city: form.city,
        pincode: form.pincode,
        districtId: form.district,
        stateId: form.state,
        countryId: form.country,
        currentDayDate: new Date().toISOString().split("T")[0],
        plcIds: form.plc,
        mediaDTOs: mediaFiles.map(m => ({
          id: m.id,
          mediaLabel: m.mediaLabel,
          contentType: m.file ? m.file.type : m.contentType,
          mediaBase64: m.file ? m.mediaBase64 : null,
          mediaURL: m.isExisting ? m.mediaURL : null,
        })),
      };

      const secretKey = localStorage.getItem("authToken");

      await axios.put(
        `${backendUrl}/real-estate-projects/updateProject/${projectId}`,
        payload,
        { headers: { secret_key: secretKey } }
      );

      alert("Project updated successfully!");
    } catch (err) {
      console.error("Error updating project:", err?.response?.data || err.message);
      alert("Update failed.");
    }
  };

  const inputClasses =
    "mt-1 w-full border p-3 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white";
  const labelClasses = "block font-semibold text-gray-700 dark:text-gray-300 mb-1";

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-2 lg:p-10 font-dm">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-10 rounded-xl shadow-lg space-y-8"
      >
        {/* Builder */}
        <div>
          <label className={labelClasses}>Builder *</label>
          <select
            name="builderId"
            value={form.builderId}
            onChange={handleFormChange}
            className={inputClasses}
            required
          >
            <option value="">--- Select Builder ---</option>
            {builders.map(b => (
              <option key={b.id} value={b.id}>
                {b.label}
              </option>
            ))}
          </select>
        </div>

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

        {/* RERA */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="isReraApproved"
            checked={form.isReraApproved}
            onChange={handleFormChange}
          />
          <label className={labelClasses}>RERA Approved</label>
        </div>

        {form.isReraApproved && (
          <>
            <div>
              <label className={labelClasses}>RERA</label>
              <select
                name="rera"
                value={form.rera || ""}
                onChange={handleFormChange}
                className={inputClasses}
                required
              >
                <option value="">Select RERA</option>
                {reras.map(r => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClasses}>RERA Number</label>
              <input
                type="text"
                name="reraNo"
                value={form.reraNo || ""}
                onChange={handleFormChange}
                className={inputClasses}
                required
              />
            </div>
          </>
        )}

        {/* Dates */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className={labelClasses}>Start Date</label>
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleFormChange}
              className={inputClasses}
              required
            />
          </div>
          <div>
            <label className={labelClasses}>Completion Date</label>
            <input
              type="date"
              name="completionDate"
              value={form.completionDate}
              onChange={handleFormChange}
              className={inputClasses}
              required
            />
          </div>
        </div>

        {/* Area */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className={labelClasses}>Area *</label>
            <input
              type="number"
              name="area"
              value={form.area}
              onChange={handleFormChange}
              className={inputClasses}
              required
            />
          </div>
          <div>
            <label className={labelClasses}>Area Unit</label>
            <select
              name="areaUnitId"
              value={form.areaUnitId}
              onChange={handleFormChange}
              className={inputClasses}
              required
            >
              <option value="">Select Unit</option>
              {units.map(u => (
                <option key={u.id} value={u.id}>
                  {u.unitName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Country - State - District */}
        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className={labelClasses}>Country</label>
            <select
              name="country"
              value={form.country}
              onChange={handleFormChange}
              className={inputClasses}
              required
            >
              <option value="">Select Country</option>
              {countries.map(c => (
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
              required
            >
              <option value="">Select State</option>
              {states.map(s => (
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
              required
            >
              <option value="">Select District</option>
              {districts.map(d => (
                <option key={d.id} value={d.id}>
                  {d.district}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* City and Address */}
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

        {/* Possession Status */}
        <div>
          <label className={labelClasses}>Possession Status</label>
          <select
            name="possessionStatus"
            value={form.possessionStatus}
            onChange={handleFormChange}
            className={inputClasses}
            required
          >
            <option value="">Select Status</option>
            {possessionStatusOptions.map(s => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* PLC */}
        <div>
          <label className={labelClasses}>PLCs</label>
          <div className="flex flex-wrap gap-4">
            {plcs.map(p => (
              <label key={p.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.plc.includes(p.id)}
                  onChange={() => handlePlcChange(p.id)}
                />
                {p.name}
              </label>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className={labelClasses}>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleFormChange}
            className={inputClasses}
            rows={4}
          />
        </div>

        {/* Media Upload */}
        <div>
          <label className={labelClasses}>Project Media</label>
          {mediaFiles.map(m => (
            <div key={m.id} className="flex items-center gap-3 mt-2">
              <input
                type="text"
                placeholder="Media Label"
                value={m.mediaLabel}
                onChange={e => handleMediaChange(m.id, "mediaLabel", e.target.value)}
                className="border p-2 rounded w-1/4"
              />
              <input
                type="file"
                onChange={e => handleMediaChange(m.id, "file", e.target.files[0])}
                className="border p-2 rounded w-1/4"
              />
              {m.mediaURL && (
                <img src={m.mediaURL} alt="media" className="w-16 h-16 object-cover rounded" />
              )}
              <button
                type="button"
                onClick={() => removeMediaFile(m.id)}
                className="text-red-500"
              >
                <FiX size={20} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addMediaFile}
            className="mt-2 flex items-center gap-2 text-blue-500"
          >
            <FiPlus /> Add Media
          </button>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Update Project
        </button>
      </form>
    </div>
  );
};

export default UpdateProject;
