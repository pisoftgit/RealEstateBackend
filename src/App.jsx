import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/theme-context";
import { AuthProvider } from "./ProtectedRoutes/authcontext";
import Layout from "@/routes/layout";
import DashboardPage from "@/routes/dashboard/page";
import ProfilePage from "./routes/MyProfile/Profile";
import IPAddress from "./routes/AdministrativeSetUp/IPAddress/IPAddress";
import FontFamilyManager from "./routes/AdministrativeSetUp/PiEditor/FontFamily";
import TextEditorPage from "./routes/AdministrativeSetUp/PiEditor/TestEditor";
import OrganizationSetupPage from "./routes/AdministrativeSetUp/General/Organization";
import FinancialYearManager from "./routes/AdministrativeSetUp/General/FinancialYearManager";
import CategoryManager from "./routes/AdministrativeSetUp/General/CategoryManager";
import ReligionManager from "./routes/AdministrativeSetUp/General/ReligionManager";
import CategoryCasteManager from "./routes/AdministrativeSetUp/General/CategoryCasteManager";
import BloodGroupManager from "./routes/AdministrativeSetUp/General/BloodGroupManager";
import PrefixManager from "./routes/AdministrativeSetUp/General/PrefixManager";
import CountryManager from "./routes/AdministrativeSetUp/General/CountryManager";
import StateManager from "./routes/AdministrativeSetUp/General/StateManager";
import DistrictManager from "./routes/AdministrativeSetUp/General/DistrictManager";
import CrmDocumentManager from "./routes/AdministrativeSetUp/crm/DocumentsNames";
import LeadSourceManager from "./routes/AdministrativeSetUp/crm/LeadGeneration";
import DepartmentManager from "./routes/AdministrativeSetUp/HR/GeneralSetup/DepartmentManager";
import DesignationManager from "./routes/AdministrativeSetUp/HR/GeneralSetup/DesignationManager";
import EmployeeTypeManager from "./routes/AdministrativeSetUp/HR/GeneralSetup/EmployeeTypeManger";
import AttendanceNotationManager from "./routes/AdministrativeSetUp/HR/GeneralSetup/AttendenceNotationManager";
import Duration from "./routes/AdministrativeSetUp/HR/GeneralSetup/Duration";
import RelievingReasonManager from "./routes/AdministrativeSetUp/HR/GeneralSetup/RelievingReasons";
import LevelManager from "./routes/AdministrativeSetUp/HR/Hierarchy/LevelConfiguration";
import LevelDesignationManager from "./routes/AdministrativeSetUp/HR/Hierarchy/DesignationLevels";
import LeaveSetup from "./routes/AdministrativeSetUp/HR/Level Management/LeaveSetup";
import EarnedLeaveSetup from "./routes/AdministrativeSetUp/HR/Level Management/EarnedLeaves";
import LeaveStatusSetup from "./routes/AdministrativeSetUp/HR/Level Management/LeaveStatus";
import LeaveApprovalConfig from "./routes/AdministrativeSetUp/HR/Level Management/LeaveApprovalConfig";
import LeaveApprovalHierarchy from "./routes/AdministrativeSetUp/HR/Level Management/LeaveApproval";
import ConfigureHolidayType from "./routes/AdministrativeSetUp/HR/Holiday Management/HolidayType";
import ConfigureHolidaySetup from "./routes/AdministrativeSetUp/HR/Holiday Management/HolidaySetup";
import ConfigureBusinessNature from "./routes/AdministrativeSetUp/Property/BusinessNature";
import ConfigurePropertyNature from "./routes/AdministrativeSetUp/Property/PropertyNature";
import PropertyType from "./routes/AdministrativeSetUp/Property/PropertyType";
import ConfigureSubPropertyType from "./routes/AdministrativeSetUp/Property/SubPropertyType";
import ConfigurePropertyItems from "./routes/AdministrativeSetUp/Property/PropertyItems";
import ConfigureTowerPropertyItems from "./routes/AdministrativeSetUp/Property/TowerPropertyItems";
import ConfigureRERAs from "./routes/AdministrativeSetUp/Property/RERA";
import ConfigureFaceDirection from "./routes/AdministrativeSetUp/Property/FaceDirection";
import ConfigureFacility from "./routes/AdministrativeSetUp/Property/Facility";
import ConfigureAmenity from "./routes/AdministrativeSetUp/Property/Amenity";
import ConfigureFurnishingStatus from "./routes/AdministrativeSetUp/Property/FurnishingStatus";
import ConfigureFlatStructure from "./routes/AdministrativeSetUp/Property/FlatStructure";
import ConfigureFlatHouseStructure from "./routes/AdministrativeSetUp/Property/FlatStructureType";
import ConfigureRoomType from "./routes/AdministrativeSetUp/Property/RoomType";
import ConfigureParkingType from "./routes/AdministrativeSetUp/Property/ParkingType";
import ConfigureOwnershipType from "./routes/AdministrativeSetUp/Property/OwnershipType";
import ConfigureShopCategory from "./routes/AdministrativeSetUp/Property/ShowroomCategory";
import ConfigureMeasurementType from "./routes/AdministrativeSetUp/Property/MeasurementType";
import ConfigurePLC from "./routes/AdministrativeSetUp/Property/PLC";
import ConfigureBranch from "./routes/AdministrativeSetUp/HR/GeneralSetup/Branch";
import AddEmployee from "./routes/Human Resources/Employee Management/AddEmployee";
import EmployeeListComponent from "./routes/Human Resources/Employee Management/UpdateViewEmployee";
import EmployeePasswordManagement from "./routes/Human Resources/Employee Management/ResetPassword";
import DailyAttendanceMarker from "./routes/Human Resources/EmployeeAttendence/AttendenceMark";
import AddCustomer from "./routes/CRM/Customer/AddCustomer";
import CustomerManagement from "./routes/CRM/Customer/ManageCustomer";
import CustomerLeadDetails from "./routes/CRM/Customer Lead/CustomerLead";
import ManageLeads from "./routes/CRM/Customer Lead/ManageLeads";
import AppointmentsHistory from "./routes/CRM/Customer Lead/AppointmentHistory";
import MonthlyDetailedAttendance from "./routes/Human Resources/EmployeeAttendence/AttendenceView";
import UserForm from "./routes/Users/AddUser";
import UserSearchManage from "./routes/Users/ManageUsers";
import AddRealtorForm from "./routes/Realtor and Properties/Realtor/AddRealtor";
import ManageBuilders from "./routes/Realtor and Properties/Realtor/ManageRealtor";
import AddProject from "./routes/Realtor and Properties/Project/AddProject";
import ManageProjects from "./routes/Realtor and Properties/Project/ManageProject";
import SerializeLink from "./routes/Realtor and Properties/Property/SerializeLink";
import PropertyDetails from "./routes/Realtor and Properties/Property/PropertyDetails";
import ManagePropertyDetails from "./routes/Realtor and Properties/Property/ManagePropertyDetails";

import PrivateRoute from "./ProtectedRoutes/PrivateRoute";
import LoginPage from "./ProtectedRoutes/Login";
import UpdateProjectPage from "./routes/Realtor and Properties/Project/UpdateProject";
import ProjectSummary from "./routes/Realtor and Properties/Project/PropertySummary";
import SerializedPropertiesPage from "./routes/Realtor and Properties/Property/ManageSerializedProperty";
import ViewSerializedProperty from "./routes/Realtor and Properties/Property/ViewSerializedProperty";
import FillDetailsHouseVilla from "./routes/Realtor and Properties/Property/HouseVillaFillDetails";
import DayEnd from "./routes/DayEnd";
import UpdateTower from "./routes/Realtor and Properties/Property/TowerManage/updateTower";
import AssignProperty from "./routes/Realtor and Properties/UnderWritten/UnderWriteProperty";
import EmployeeDocumentsManager from "./routes/AdministrativeSetUp/HR/GeneralSetup/EmployeeDocumentManager";

function App() {
    return (
        <AuthProvider>
            <ThemeProvider storageKey="theme">
                <BrowserRouter>
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route element={<PrivateRoute />}>
                            <Route path="/" element={<Layout />}>
                                <Route index element={<DashboardPage />} />
                                <Route path="/MyProfile" element={<ProfilePage />} />
                                <Route path="/IPAddress" element={<IPAddress />} />

                                <Route path="/piEditor" element={<h1>piEditor</h1>} />
                                <Route path="/piEditor/Font-family" element={<FontFamilyManager />} />
                                <Route path="/piEditor/test-editor" element={<TextEditorPage />} />

                                <Route path="/AdministrativeGeneral" element={<h1>General</h1>} />
                                <Route path="/General/Organization" element={<OrganizationSetupPage />} />
                                <Route path="/General/Financial-Year" element={<FinancialYearManager />} />
                                <Route path="/General/User-Category" element={<CategoryManager />} />
                                <Route path="/General/Religion" element={<ReligionManager />} />
                                <Route path="/General/Category" element={<CategoryCasteManager />} />
                                <Route path="/General/Blood-Group" element={<BloodGroupManager />} />
                                <Route path="/General/Prefix" element={<PrefixManager />} />
                                <Route path="/General/Country" element={<CountryManager />} />
                                <Route path="/General/State" element={<StateManager />} />
                                <Route path="/General/District" element={<DistrictManager />} />

                                <Route path="/CRM" element={<h1>CRM</h1>} />
                                <Route path="/CRM/DocumentsName" element={<CrmDocumentManager />} />
                                <Route path="/CRM/Lead-Generation" element={<LeadSourceManager />} />

                                <Route path="/HumanResource" element={<h1>Human Resource</h1>} />
                                <Route path="/HR/GeneralSetup/Branch" element={<ConfigureBranch />} />
                                <Route path="/HR/GeneralSetup/Departments" element={<DepartmentManager />} />
                                <Route path="/HR/GeneralSetup/Designations" element={<DesignationManager />} />
                                <Route path="/HR/GeneralSetup/Employee-Type" element={<EmployeeTypeManager />} />
                                <Route path="/HR/GeneralSetup/Documents" element={<EmployeeDocumentsManager />} />
                                <Route path="/HR/GeneralSetup/Duration" element={<Duration />} />
                                <Route path="/HR/GeneralSetup/Relieving-Reasons" element={<RelievingReasonManager />} />
                                <Route path="/HR/GeneralSetup/Attendence-Notation" element={<AttendanceNotationManager />} />


                                <Route path="/HR/Hierarchy" element={<h1>Hierarchy</h1>} />
                                <Route path="/HR/Hierarchy/Level-Configurations" element={<LevelManager />} />
                                <Route path="/HR/Hierarchy/Designation-Levels" element={<LevelDesignationManager />} />


                                <Route path="/HR/Leave-Management" element={<h1>Hierarchy</h1>} />
                                <Route path="/HR/Leave-Management/Leave-Setup" element={<LeaveSetup />} />
                                <Route path="/HR/Leave-Management/Earned-Leaves" element={<EarnedLeaveSetup />} />
                                <Route path="/HR/Leave-Management/Leave-Status" element={<LeaveStatusSetup />} />
                                <Route path="/HR/Leave-Management/Leave-Approval-config" element={<LeaveApprovalConfig />} />
                                <Route path="/HR/Leave-Management/Leave-Approval" element={<LeaveApprovalHierarchy />} />


                                <Route path="/HR/Holiday-Management" element={<h1>Holiday Management</h1>} />
                                <Route path="/HR/Holiday-Management/HolidayType" element={<ConfigureHolidayType />} />
                                <Route path="/HR/Holiday-Management/Holiday-setup" element={<ConfigureHolidaySetup />} />


                                <Route path="/Property" element={<h1>Property</h1>} />
                                <Route path="/Property/Business-Nature" element={<ConfigureBusinessNature />} />
                                <Route path="/Property/Property-Nature" element={<ConfigurePropertyNature />} />
                                <Route path="/Property/Property-Type" element={<PropertyType />} />
                                <Route path="/Property/Sub-Property-Type" element={<ConfigureSubPropertyType />} />
                                <Route path="/Property/Property-Item" element={<ConfigurePropertyItems />} />
                                <Route path="/Property/Tower-Property-Item" element={<ConfigureTowerPropertyItems />} />
                                <Route path="/Property/RERA" element={<ConfigureRERAs />} />
                                <Route path="/Property/Face-Direction" element={<ConfigureFaceDirection />} />
                                <Route path="/Property/Facility" element={<ConfigureFacility />} />
                                <Route path="/Property/Amenity" element={<ConfigureAmenity />} />
                                <Route path="/Property/Furnishing-Status" element={<ConfigureFurnishingStatus />} />
                                <Route path="/Property/flat/house-structure" element={<ConfigureFlatStructure />} />
                                <Route path="/Property/flat/house-structure-type" element={<ConfigureFlatHouseStructure />} />
                                <Route path="/Property/RoomType" element={<ConfigureRoomType />} />
                                <Route path="/Property/Parking-Type" element={<ConfigureParkingType />} />
                                <Route path="/Property/OwnershipType" element={<ConfigureOwnershipType />} />
                                <Route path="/Property/Shop-Showroom-Category" element={<ConfigureShopCategory />} />
                                <Route path="/Property/Measurement-Units" element={<ConfigureMeasurementType />} />
                                <Route path="/Property/PLC" element={<ConfigurePLC />} />

                                <Route path="/EmployeeManagement" element={<h1>Employee Management</h1>} />
                                <Route path="/EmployeeManagement/AddEmployee" element={<AddEmployee />} />
                                <Route path="/EmployeeManagement/View/Update-Employee" element={<EmployeeListComponent />} />
                                <Route path="/EmployeeManagement/resetPassword" element={<EmployeePasswordManagement />} />

                                <Route path="/EmployeeAttendence" element={<h1>Employee Attendence mark</h1>} />
                                <Route path="/EmployeeAttendence/MarkAttendence" element={<DailyAttendanceMarker />} />
                                <Route path="/EmployeeAttendence/ViewAttendence" element={<MonthlyDetailedAttendance />} />

                                <Route path="/Realtor&Properties/Realtor" element={<h1>Realtor</h1>} />
                                <Route path="/Realtor&Properties/Realtor/AddRealtor" element={<AddRealtorForm />} />
                                <Route path="/Realtor&Properties/Realtor/ManageRealtor" element={<ManageBuilders />} />



                                <Route path="/Project" element={<h1>Project</h1>} />
                                <Route path="/Realtor&Properties/Project/AddProject" element={<AddProject />} />
                                <Route path="/Realtor&Properties/Project/ManageProject" element={<ManageProjects />} />
                                <Route path="/update-project/:projectId" element={<UpdateProjectPage />} />
                                <Route path="/project-summary/:id" element={<ProjectSummary />} />


                                <Route path="/Realtor&Properties/Property/" element={<h1>Property</h1>} />
                                <Route path="/Realtor&Properties/Property/Serialize&Link" element={<SerializeLink />} />
                                <Route path="/Realtor&Properties/Property/Serialize&Link/PropertyDetails/:id" element={<PropertyDetails />} />
                                <Route path="/Realtor&Properties/Property/ManagePropertyDetails" element={<ManagePropertyDetails />} />
                                <Route path="/serialized-properties/projectId/:id" element={<SerializedPropertiesPage />} />
                                <Route path="/Realtor&Properties/Property/ViewSerialized/PropertyDetails/:projectId" element={<ViewSerializedProperty />} />
                                {/* <Route
                                    path="/flat/fillDetails/:params"
                                    element={<FillDetails />}
                                /> */}

                                <Route
                                    path="/houseVilla/fillDetails/:params"
                                    element={<FillDetailsHouseVilla />}
                                />

                                {/* <Route
                                    path="/plot/fillDetails/:params"
                                    element={<FillDetails />}
                                />

                                <Route
                                    path="/commercial/fillDetails/:params"
                                    element={<FillDetails />}
                                /> */}
                                
                                <Route path="/floor/updateTower" element={<UpdateTower/>} />


                                <Route path="/Builder" element={<h1>Builder</h1>} />
                                <Route path="/UnderWriting" element={<h1>UnderWriting</h1>} />
                                <Route path="/Employee" element={<h1>Employee</h1>} />


                                <Route path="/CR/Customer" element={<h1>Customer</h1>} />
                                <Route path="/CR/Customer/AddCustomer" element={<AddCustomer />} />
                                <Route path="/CR/Customer/ManageCustomer" element={<CustomerManagement />} />
                                <Route path="/CR/CL/CustomerLead" element={<CustomerLeadDetails />} />


                                <Route path="/CR/CustomerLead" element={<h1>CustomerLead</h1>} />
                                <Route path="/CR/CL/ManageCustomerLead" element={<ManageLeads />} />
                                <Route path="/CR/CL/Appointments" element={<AppointmentsHistory />} />


                                <Route path="/Realtor&Properties/UnderWriting/underwriteProperty" element={<AssignProperty />} />

                                <Route path="/AddUsers" element={<UserForm />} />
                                <Route path="/ManageUsers" element={<UserSearchManage />} />
                                <Route path="/DayEnd" element={<DayEnd />} />
                            </Route>
                        </Route>

                        <Route path="*" element={<h1>404: Not Found</h1>} />
                    </Routes>
                </BrowserRouter>
            </ThemeProvider>
        </AuthProvider>
    );
}

export default App;