import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import useFurnishingStatus from '../../../hooks/propertyConfig/useFurnishingStatus';
import useAmenities from '../../../hooks/propertyConfig/useAmenities';
import useFacilities from '../../../hooks/propertyConfig/useAllFacilities';
import useFaceDirections from '../../../hooks/propertyConfig/useFaceDirections';
import useUnitDetails from '../../../hooks/propertyConfig/useMeasurementUnits';

const FillDetailsHouseVilla = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { params } = useParams();

  const queryParams = new URLSearchParams(params);
  const projectId = queryParams.get('projectId');
  const selectedUnitIds = queryParams.getAll('unitIds').flatMap(id => id.split(',').map(Number));

  const { data: furnishingStatusOptions } = useFurnishingStatus();
  const { data: amenitiesOptions } = useAmenities();
  const { data: facilitiesOptions } = useFacilities();
  const { data: faceDirectionsOptions } = useFaceDirections();

  const { data: unitsData, isLoading, error } = useUnitDetails(selectedUnitIds || []);

  const [unitsDetails, setUnitsDetails] = useState([]);

  useEffect(() => {
    if (unitsData && selectedUnitIds?.length) {
      const initialData = selectedUnitIds.map(id => {
        const unitFromApi = unitsData.find(u => u.houseVillaId === id);
        return unitFromApi
          ? {
              houseVillaId: unitFromApi.houseVillaId,
              furnishingStatus: unitFromApi.furnishingStatus || '',
              faceDirection: unitFromApi.faceDirection || '',
              carpetArea: unitFromApi.carpetArea || '',
              carpetAreaUnit: unitFromApi.carpetAreaUnit || 'Sqr. ft.',
              loadingPercent: unitFromApi.loadingPercent || '',
              superArea: unitFromApi.superArea || '',
              noOfFloor: unitFromApi.noOfFloor || '',
              noOfKitchen: unitFromApi.noOfKitchen || '',
              amenities: unitFromApi.amenities?.map(a => a.id) || [],
              facilities: unitFromApi.facilities?.map(f => f.id) || [],
              basicCost: unitFromApi.basicCost || '',
              description: unitFromApi.description || '',
              deleteExistingMedia: false,
              mediaFiles: (unitFromApi.propertyMediaDTOs || []).map(({ label }) => ({ label, file: null })) || [{ label: '', file: null }],
            }
          : {
              houseVillaId: id,
              furnishingStatus: '',
              faceDirection: '',
              carpetArea: '',
              carpetAreaUnit: 'Sqr. ft.',
              loadingPercent: '',
              superArea: '',
              noOfFloor: '',
              noOfKitchen: '',
              amenities: [],
              facilities: [],
              basicCost: '',
              description: '',
              deleteExistingMedia: false,
              mediaFiles: [{ label: '', file: null }],
            };
      });
      setUnitsDetails(initialData);
    }
  }, [unitsData, selectedUnitIds]);

  const handleChange = (index, field, value) => {
    setUnitsDetails(prev => {
      const copy = [...prev];
      copy[index][field] = value;
      return copy;
    });
  };

  const handleAmenityChange = (index, selectedAmenities) => {
    setUnitsDetails(prev => {
      const copy = [...prev];
      copy[index].amenities = selectedAmenities;
      return copy;
    });
  };

  const handleFacilityChange = (index, selectedFacilities) => {
    setUnitsDetails(prev => {
      const copy = [...prev];
      copy[index].facilities = selectedFacilities;
      return copy;
    });
  };

  const handleMediaLabelChange = (unitIndex, mediaIndex, label) => {
    setUnitsDetails(prev => {
      const copy = [...prev];
      copy[unitIndex].mediaFiles[mediaIndex].label = label;
      return copy;
    });
  };

  const handleMediaFileChange = (unitIndex, mediaIndex, file) => {
    setUnitsDetails(prev => {
      const copy = [...prev];
      copy[unitIndex].mediaFiles[mediaIndex].file = file;
      return copy;
    });
  };

  const addMediaFileRow = (unitIndex) => {
    setUnitsDetails(prev => {
      const copy = [...prev];
      copy[unitIndex].mediaFiles.push({ label: '', file: null });
      return copy;
    });
  };

  const removeMediaFileRow = (unitIndex, mediaIndex) => {
    setUnitsDetails(prev => {
      const copy = [...prev];
      if (copy[unitIndex].mediaFiles.length > 1) {
        copy[unitIndex].mediaFiles.splice(mediaIndex, 1);
      }
      return copy;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      projectId,
      units: unitsDetails.map(unit => ({
        houseVillaId: unit.houseVillaId,
        furnishingStatus: unit.furnishingStatus,
        faceDirection: unit.faceDirection,
        carpetArea: unit.carpetArea,
        carpetAreaUnit: unit.carpetAreaUnit,
        loadingPercent: unit.loadingPercent,
        superArea: unit.superArea,
        noOfFloor: unit.noOfFloor,
        noOfKitchen: unit.noOfKitchen,
        amenities: unit.amenities,
        facilities: unit.facilities,
        basicCost: unit.basicCost,
        description: unit.description,
        shouldDeletePreviousMedia: unit.deleteExistingMedia,
        propertyMediaDTOs: unit.mediaFiles.map(({ label, file }) => ({ label, file })),
      })),
    };
    console.log('Submitting:', payload);
    // API call goes here
  };

  if (isLoading) return <p>Loading units...</p>;
  if (error) return <p>Error loading units.</p>;
  if (!selectedUnitIds?.length) return <p>No units selected.</p>;

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 900, margin: 'auto' }}>
      <h2>Fill Details for House/Villa Units</h2>

      {unitsDetails.map((unit, i) => (
        <section key={unit.houseVillaId} style={{ border: '1px solid #ddd', marginBottom: 30, padding: 20, borderRadius: 6 }}>
          <h3 style={{ marginBottom: 15 }}>Unit ID: {unit.houseVillaId}</h3>

          {/* Basic Details */}
          <fieldset style={{ marginBottom: 20, border: '1px solid #ccc', padding: 15 }}>
            <legend><b>Basic Details</b></legend>

            <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: 15 }}>
              <label style={{ flex: 1 }}>
                Furnishing Status
                <br />
                <select
                  value={unit.furnishingStatus}
                  onChange={e => handleChange(i, 'furnishingStatus', e.target.value)}
                  style={{ width: '100%' }}
                >
                  <option value="">--- Select Furnishing Structure ---</option>
                  {furnishingStatusOptions?.map(opt => (
                    <option key={opt.id} value={opt.id}>{opt.name}</option>
                  ))}
                </select>
              </label>

              <label style={{ flex: 1 }}>
                Face Direction
                <br />
                <select
                  value={unit.faceDirection}
                  onChange={e => handleChange(i, 'faceDirection', e.target.value)}
                  style={{ width: '100%' }}
                >
                  <option value="">--- Select Face Directions ---</option>
                  {faceDirectionsOptions?.map(opt => (
                    <option key={opt.id} value={opt.id}>{opt.name}</option>
                  ))}
                </select>
              </label>
            </div>

            <div style={{ border: '1px solid #333', backgroundColor: '#e7e7e7', fontWeight: 'bold', padding: 5, marginBottom: 5 }}>
              Area Details
            </div>

            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <input
                type="number"
                placeholder="Carpet Area"
                value={unit.carpetArea}
                onChange={e => handleChange(i, 'carpetArea', e.target.value)}
                style={{ flex: 2, padding: '6px' }}
              />

              <select
                value={unit.carpetAreaUnit}
                onChange={e => handleChange(i, 'carpetAreaUnit', e.target.value)}
                style={{ flex: 1, padding: '6px' }}
              >
                <option value="Sqr. ft.">Sqr. ft.</option>
                <option value="Sq. m.">Sq. m.</option>
                <option value="Sq. yd.">Sq. yd.</option>
              </select>

              <input
                type="number"
                placeholder="Loading (%)"
                value={unit.loadingPercent}
                onChange={e => handleChange(i, 'loadingPercent', e.target.value)}
                style={{ flex: 2, padding: '6px' }}
              />

              <input
                type="number"
                placeholder="Super Area"
                value={unit.superArea}
                onChange={e => handleChange(i, 'superArea', e.target.value)}
                style={{ flex: 2, padding: '6px' }}
              />
            </div>
          </fieldset>

          {/* Other Details */}
          <fieldset style={{ marginBottom: 20, border: '1px solid #ccc', padding: 15 }}>
            <legend><b>Other Detail(s)</b></legend>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
              <label style={{ flex: '1 1 150px' }}>
                No. Of Floor
                <br />
                <input
                  type="number"
                  value={unit.noOfFloor}
                  onChange={e => handleChange(i, 'noOfFloor', e.target.value)}
                  style={{ width: '100%', padding: '6px' }}
                />
              </label>

              <label style={{ flex: '1 1 200px' }}>
                Amenities
                <br />
                <select
                  multiple
                  value={unit.amenities}
                  onChange={e => {
                    const selected = Array.from(e.target.selectedOptions, option => Number(option.value));
                    handleAmenityChange(i, selected);
                  }}
                  style={{ width: '100%', height: 100 }}
                >
                  {amenitiesOptions?.map(opt => (
                    <option key={opt.id} value={opt.id}>{opt.name}</option>
                  ))}
                </select>
              </label>

              <label style={{ flex: '1 1 150px' }}>
                No. Of Kitchen
                <br />
                <input
                  type="number"
                  value={unit.noOfKitchen}
                  onChange={e => handleChange(i, 'noOfKitchen', e.target.value)}
                  style={{ width: '100%', padding: '6px' }}
                />
              </label>

              <label style={{ flex: '1 1 200px' }}>
                Facilities
                <br />
                <select
                  multiple
                  value={unit.facilities}
                  onChange={e => {
                    const selected = Array.from(e.target.selectedOptions, option => Number(option.value));
                    handleFacilityChange(i, selected);
                  }}
                  style={{ width: '100%', height: 100 }}
                >
                  {facilitiesOptions?.map(opt => (
                    <option key={opt.id} value={opt.id}>{opt.name}</option>
                  ))}
                </select>
              </label>

              <label style={{ flex: '1 1 150px' }}>
                Basic Cost
                <br />
                <input
                  type="number"
                  value={unit.basicCost}
                  onChange={e => handleChange(i, 'basicCost', e.target.value)}
                  style={{ width: '100%', padding: '6px' }}
                />
              </label>

              <label style={{ flex: '1 1 100%' }}>
                Description
                <br />
                <textarea
                  value={unit.description}
                  onChange={e => handleChange(i, 'description', e.target.value)}
                  style={{ width: '100%', minHeight: 60, padding: '6px' }}
                />
              </label>
            </div>
          </fieldset>

          {/* Images/Videos */}
          <fieldset style={{ border: '1px solid #ccc', padding: 15 }}>
            <legend><b>Images/Videos</b></legend>

            <div
              style={{
                backgroundColor: '#fff4cc',
                border: '1px solid #f7e08b',
                padding: 8,
                marginBottom: 15,
                fontSize: '0.9em',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <span style={{ fontWeight: 'bold', color: '#a68000' }}>Delete Existing Files:</span>
              <label>
                <input
                  type="radio"
                  checked={unit.deleteExistingMedia === true}
                  onChange={() => handleChange(i, 'deleteExistingMedia', true)}
                />{' '}
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  checked={unit.deleteExistingMedia === false}
                  onChange={() => handleChange(i, 'deleteExistingMedia', false)}
                />{' '}
                No
              </label>
            </div>

            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                textAlign: 'left',
                marginBottom: 15,
              }}
            >
              <thead style={{ backgroundColor: '#4a708b', color: 'white' }}>
                <tr>
                  <th style={{ padding: '6px', border: '1px solid #ddd', width: 50 }}>S/N</th>
                  <th style={{ padding: '6px', border: '1px solid #ddd' }}>Label</th>
                  <th style={{ padding: '6px', border: '1px solid #ddd' }}>Upload File</th>
                  <th style={{ padding: '6px', border: '1px solid #ddd', width: 120 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {unit.mediaFiles.map((media, mediaIndex) => (
                  <tr key={mediaIndex}>
                    <td style={{ padding: '6px', border: '1px solid #ddd' }}>{mediaIndex + 1}</td>
                    <td style={{ padding: '6px', border: '1px solid #ddd' }}>
                      <input
                        type="text"
                        placeholder="Enter label..."
                        value={media.label}
                        onChange={e => handleMediaLabelChange(i, mediaIndex, e.target.value)}
                        style={{ width: '100%', padding: '4px' }}
                      />
                    </td>
                    <td style={{ padding: '6px', border: '1px solid #ddd' }}>
                      <input
                        type="file"
                        onChange={e => handleMediaFileChange(i, mediaIndex, e.target.files[0])}
                        style={{ width: '100%' }}
                      />
                    </td>
                    <td style={{ padding: '6px', border: '1px solid #ddd' }}>
                      <button type="button" onClick={() => addMediaFileRow(i)} title="Add" style={{ marginRight: 8 }}>
                        ➕
                      </button>
                      <button type="button" onClick={() => removeMediaFileRow(i, mediaIndex)} title="Remove" disabled={unit.mediaFiles.length <= 1}>
                        ➖
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </fieldset>
        </section>
      ))}

      <button
        type="submit"
        style={{
          backgroundColor: '#007bff',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: 16,
        }}
      >
        Submit
      </button>
    </form>
  );
};

export default FillDetailsHouseVilla;
