import { LayoutDashboard, User, Wifi, PencilRuler, Info, Users, PersonStanding, MapPinHouse, IdCard, SquarePen, BookPlus, HandCoins, Activity, DoorClosed, KeyRound, Pickaxe, FolderDot, TableProperties, PencilLine, Contact, CircleUser, CalendarRange, UserRoundPlus, UserRoundCog, CornerDownRight, ChevronRight, } from "lucide-react";
import { FaIdCardClip } from "react-icons/fa6";
import ProfileImage from "@/assets/profile-image.jpg";
import ProductImage from "@/assets/product-image.jpg";

export const navbarLinks = [
  {
    title: "Dashboard",
    links: [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
        path: "/",
      },
    ],
  },
  {
    title: "My Profile",
    links: [
      {
        label: "My Profile",
        icon: User,
        path: "/MyProfile",
      },
    ],
  },
  {
    title: "Administrative Setup",
    links: [
      {
        label: "IP Address",
        icon: Wifi,
        path: "/IPAddress",
      },
      {
        label: "Pi-Editor",
        icon: PencilRuler,
        path: "/piEditor",
        subMenu: [
          {
            label: "Font-Family",
            icon: ChevronRight,
            path: "/piEditor/Font-family",
          },
          {
            label: "Test Editor",
            icon: ChevronRight,
            path: "/piEditor/test-editor",
          },
        ],
      },
      {
        label: "General",
        icon: Info,
        path: "/AdministrativeGeneral",
        subMenu: [
          {
            label: "Organization",
            icon: ChevronRight,
            path: "/General/Organization",
          },
          {
            label: "Financial Year",
            icon: ChevronRight,
            path: "/General/Financial-Year",
          },
          {
            label: "User Category",
            icon: ChevronRight,
            path: "/General/User-Category",
          },
          {
            label: "Religion",
            icon: ChevronRight,
            path: "/General/Religion",
          },
          {
            label: "Category",
            icon: ChevronRight,
            path: "/General/Category",
          },
          {
            label: "Prefix",
            icon: ChevronRight,
            path: "/General/Prefix",
          },
          {
            label: "Blood Group",
            icon: ChevronRight,
            path: "/General/Blood-Group",
          },
          {
            label: "Location Master",
            icon: ChevronRight,
            path: "/HR/LocationMaster",
            subMenu: [
              {
                label: "Country",
                icon: CornerDownRight,
                path: "/General/Country",
              },
              {
                label: "State",
                icon: CornerDownRight,
                path: "/General/State",
              },
              {
                label: "District",
                icon: CornerDownRight,
                path: "/General/District",
              },
            ],
          },
        ],
      },
      {
        label: "CRM",
        icon: Users,
        path: "/CRM",
        subMenu: [
          {
            label: "Document Names",
            icon: ChevronRight,
            path: "/CRM/DocumentsName",
          },
          {
            label: "Lead Generation",
            icon: ChevronRight,
            path: "/CRM/Lead-Generation",
          },
        ],
      },
      {
        label: "HR",
        icon: PersonStanding,
        path: "/HumanResources",
        subMenu: [
          {
            label: "General Setup",
            icon: ChevronRight,
            path: "/HR/GeneralSetup",
            subMenu: [
              { label: "Branch", icon: CornerDownRight, path: "/HR/GeneralSetup/Branch" },
              { label: "Departments", icon: CornerDownRight, path: "/HR/GeneralSetup/Departments" },
              { label: "Designations", icon: CornerDownRight, path: "/HR/GeneralSetup/Designations" },
              { label: "Employee Type", icon: CornerDownRight, path: "/HR/GeneralSetup/Employee-Type" },
              { label: "Documents", icon: CornerDownRight, path: "/HR/GeneralSetup/Documents" },
              { label: "Duration", icon: CornerDownRight, path: "/HR/GeneralSetup/Duration" },
              { label: "Attendance Notation", icon: CornerDownRight, path: "/HR/GeneralSetup/Attendence-Notation" },
              { label: "Relieving Reasons", icon: CornerDownRight, path: "/HR/GeneralSetup/Relieving-Reasons" },
            ],
          },
          {
            label: "Hierarchy",
            icon: ChevronRight,
            path: "/HR/Hierarchy",
            subMenu: [
              { label: "Level Configurations", icon: CornerDownRight, path: "/HR/Hierarchy/Level-Configurations" },
              { label: "Designation Levels", icon: CornerDownRight, path: "/HR/Hierarchy/Designation-Levels" },
            ],
          },
          {
            label: "Leave Management",
            icon: ChevronRight,
            path: "/HR/Leave-Management",
            subMenu: [
              { label: "Leave Setup", icon: CornerDownRight, path: "/HR/Leave-Management/Leave-Setup" },
              { label: "Earned Leaves", icon: CornerDownRight, path: "/HR/Leave-Management/Earned-Leaves" },
              { label: "Leave Status", icon: CornerDownRight, path: "/HR/Leave-Management/Leave-Status" },
              { label: "Leave Approval Config", icon: CornerDownRight, path: "/HR/Leave-Management/Leave-Approval-config" },
              { label: "Leave Approval", icon: CornerDownRight, path: "/HR/Leave-Management/Leave-Approval" },
            ],
          },
          {
            label: "Holiday Management",
            icon: ChevronRight,
            path: "/HR/Holiday-Management",
            subMenu: [
              { label: "Holiday Type", icon: CornerDownRight, path: "/HR/Holiday-Management/HolidayType" },
              { label: "Holiday Setup", icon: CornerDownRight, path: "/HR/Holiday-Management/Holiday-setup" },
            ],
          },
        ],
      },
      {
        label: "Property",
        icon: MapPinHouse,
        path: "/Property",
        subMenu: [
          { label: "Business Nature", icon: ChevronRight, path: "/Property/Business-Nature" },
          { label: "Property Nature", icon: ChevronRight, path: "/Property/Property-Nature" },
          { label: "Property Type", icon: ChevronRight, path: "/Property/Property-Type" },
          { label: "Sub Property Type", icon: ChevronRight, path: "/Property/Sub-Property-Type" },
          // { label: "Property Item", icon: CornerDownRight, path: "/Property/Property-Item" },
          { label: "Tower Property Item", icon: ChevronRight, path: "/Property/Tower-Property-Item" },
          { label: "RERA", icon: ChevronRight, path: "/Property/RERA" },
          { label: "Face Direction", icon: ChevronRight, path: "/Property/Face-Direction" },
          { label: "Facility", icon: ChevronRight, path: "/Property/Facility" },
          { label: "Amenity", icon: ChevronRight, path: "/Property/Amenity" },
          { label: "Furnishing Status", icon: ChevronRight, path: "/Property/Furnishing-Status" },
          { label: "Flat/House Structure Type", icon: ChevronRight, path: "/Property/flat/house-structure-type" },
          { label: "Flat/House Structure", icon: ChevronRight, path: "/Property/flat/house-structure" },
          { label: "Room Type", icon: ChevronRight, path: "/Property/RoomType" },
          { label: "Parking Type", icon: ChevronRight, path: "/Property/Parking-Type" },
          { label: "Ownership Type", icon: ChevronRight, path: "/Property/OwnershipType" },
          { label: "Shop-Showroom Category", icon: ChevronRight, path: "/Property/Shop-Showroom-Category" },
          { label: "Measurement Units", icon: ChevronRight, path: "/Property/Measurement-Units" },
          { label: "PLC", icon: ChevronRight, path: "/Property/PLC" },
        ],
      },
    ],
  },
  {
    title: "Human Resources",
    links: [
      {
        label: "Manage Employee",
        icon: IdCard,
        path: "/EmployeeManagement",
        subMenu: [
          { label: "Add Employee", icon: ChevronRight, path: "/EmployeeManagement/AddEmployee" },
          { label: "View/Update Employee", icon: ChevronRight, path: "/EmployeeManagement/View/Update-Employee" },
          // { label: "Employee Hierarchy", icon: CornerDownRight, path: "/EmployeeManagement/EmployeeHierarchy" },
          { label: "Reset Password", icon: ChevronRight, path: "/EmployeeManagement/resetPassword" },
        ],
      },
      {
        label: "Employee Attendance",
        icon: IdCard,
        path: "/EmployeeAttendence",
        subMenu: [
          { label: "Mark Attendance", icon: ChevronRight, path: "/EmployeeAttendence/MarkAttendence" },
          { label: "View Attendance", icon: ChevronRight, path: "/EmployeeAttendence/ViewAttendence" },
        ],
      },
      {
        label: "Today Attendance",
        icon: SquarePen,
        path: "/HumanResources/TodayAttendence",
        subMenu: [
          { label: "Mark Today Attendance", icon: ChevronRight, path: "/HumanResources/TodayAttendence/MarkTodayAttendence" },
        ],
      },
      {
        label: "Leave Management",
        icon: BookPlus,
        path: "/HumanResources/LeaveManagement",
        subMenu: [
          { label: "My Leave", icon: ChevronRight, path: "/HumanResources/LeaveManagement/MyLeave" },
          { label: "Leave Request", icon: ChevronRight, path: "/HumanResources/LeaveManagement/LeaveRequest" },
          { label: "Employee Leave Manage", icon: ChevronRight, path: "/HumanResources/LeaveManagement/EmployeeLeaveManage" },
        ],
      },
      {
        label: "Employee Salary",
        icon: HandCoins,
        path: "/HumanResources/EmployeeSalary",
        subMenu: [
          { label: "Monthly Salary", icon: ChevronRight, path: "/HumanResources/EmployeeSalary/MonthlySalary" },
          { label: "View Salary", icon: ChevronRight, path: "/HumanResources/EmployeeSalary/ViewSalary" },
          { label: "Salary Slip", icon: ChevronRight, path: "/HumanResources/EmployeeSalary/SalarySlips" },
        ],
      },
      {
        label: "ID Card",
        icon: FaIdCardClip,
        path: "/HumanResources/IDCard",
      },
      {
        label: "Movement Register",
        icon: Activity,
        path: "/HumanResources/MovementRegister",
        subMenu: [
          { label: "My Movements", icon: ChevronRight, path: "/HumanResources/MovementRegister/MyMovements" },
          { label: "Movement Request", icon: ChevronRight, path: "/HumanResources/MovementRegister/MovementRequest" },
          { label: "Movement Req Manage", icon: ChevronRight, path: "/HumanResources/MovementRegister/MovementRequestManage" },
        ],
      },
      {
        label: "Employee Exit",
        icon: DoorClosed,
        path: "/HumanResources/EmployeeExist",
        subMenu: [
          { label: "Relieving Letter", icon: ChevronRight, path: "/HumanResources/EmployeeExist/RelievingLetter" },
          { label: "Experience Letter", icon: ChevronRight, path: "/HumanResources/EmployeeExist/ExperienceLetter" },
          { label: "Employee Relieved", icon: ChevronRight, path: "/HumanResources/EmployeeExist/EmployeeRelieved" },
        ],
      },
      {
        label: "Employee Status",
        icon: KeyRound,
        path: "/HumanResources/EmployeeStatus",
        subMenu: [
          { label: "Update Status", icon: ChevronRight, path: "/HumanResources/EmployeeStatus/UpdateStatus" },
        ],
      },
    ],
  },
  {
    title: "Realtor & Properties",
    links: [
      {
        label: "Realtor",
        icon: Pickaxe,
        path: "/Realtor&Properties/Realtor",
        subMenu: [
          { label: "Add Realtor", icon: ChevronRight, path: "/Realtor&Properties/Realtor/AddRealtor" },
          { label: "Manage Realtor", icon: ChevronRight, path: "/Realtor&Properties/Realtor/ManageRealtor" },
        ],
      },
      {
        label: "Project",
        icon: FolderDot,
        path: "/Realtor&Properties/Project",
        subMenu: [
          { label: "Add Project", icon: ChevronRight, path: "/Realtor&Properties/Project/AddProject" },
          { label: "Manage Project", icon: ChevronRight, path: "/Realtor&Properties/Project/ManageProject" },
        ],
      },
      {
        label: "Property",
        icon: TableProperties,
        path: "/Realtor&Properties/Property",
        subMenu: [
          { label: "Serialize & Link Property", icon: ChevronRight, path: "/Realtor&Properties/Property/Serialize&Link" },
          { label: "Manage Property", icon: ChevronRight, path: "/Realtor&Properties/Property/ManagePropertyDetails" },
        ],
      },
      {
        label: "UnderWriting",
        icon: PencilLine,
        path: "/Realtor&Properties/UnderWriting",
        subMenu: [
          { label: "Underwrite Property", icon: ChevronRight, path: "/Realtor&Properties/UnderWriting/underwriteProperty" },
          { label: "Underwritten Property", icon: ChevronRight, path: "/Realtor&Properties/UnderWriting/underwriteProperty" },
        ],
      },
    ],
  },
  {
    title: "Role and Management",
    links: [
      {
        label: "Employee",
        icon: Contact,
        path: "/R&M/Employee",
        subMenu: [
          { label: "Roles", icon: ChevronRight, path: "/R&M/Employee/Roles" },
        ],
      },
    ],
  },
  {
    title: "CRM",
    path:"/CR",
    links: [
      {
        label: "Customer",
        icon: CircleUser,
        path: "/CR/Customer",
        subMenu: [
          { label: "Add Customer", icon: ChevronRight, path: "/CR/Customer/AddCustomer" },
          { label: "Manage Customer", icon: ChevronRight, path: "/CR/Customer/ManageCustomer" },
        ],
      },
      {
        label: "Customer Lead",
        icon: CalendarRange,
        path: "/CR/CustomerLead",
        subMenu: [
          { label: "Customer Lead", icon: ChevronRight, path: "/CR/CL/CustomerLead" },
          { label: "Manage Customer Lead", icon: ChevronRight, path: "/CR/CL/ManageCustomerLead" },
          { label: "Appointments", icon: ChevronRight, path: "/CR/CL/Appointments" },
        ],
      },
      
    ],
  },
  {
    title: "Users",
    links: [
      { label: "Add Users", icon: UserRoundPlus, path: "/AddUsers" },
      { label: "Manage Users", icon: UserRoundCog, path: "/ManageUsers" },
    ],
  },
  {
        title: "Day end",
        links: [
          { label: "Day End", icon: ChevronRight, path: "/DayEnd" },
        ],
      },
];


export const overviewData = [
    {
        name: "Jan",
        total: 1500,
    },
    {
        name: "Feb",
        total: 2000,
    },
    {
        name: "Mar",
        total: 1000,
    },
    {
        name: "Apr",
        total: 5000,
    },
    {
        name: "May",
        total: 2000,
    },
    {
        name: "Jun",
        total: 5900,
    },
    {
        name: "Jul",
        total: 2000,
    },
    {
        name: "Aug",
        total: 5500,
    },
    {
        name: "Sep",
        total: 2000,
    },
    {
        name: "Oct",
        total: 4000,
    },
    {
        name: "Nov",
        total: 1500,
    },
    {
        name: "Dec",
        total: 2500,
    },
];

export const recentSalesData = [
    {
        id: 1,
        name: "Olivia Martin",
        email: "olivia.martin@email.com",
        image: ProfileImage,
        total: 1500,
    },
    {
        id: 2,
        name: "James Smith",
        email: "james.smith@email.com",
        image: ProfileImage,
        total: 2000,
    },
    {
        id: 3,
        name: "Sophia Brown",
        email: "sophia.brown@email.com",
        image: ProfileImage,
        total: 4000,
    },
    {
        id: 4,
        name: "Noah Wilson",
        email: "noah.wilson@email.com",
        image: ProfileImage,
        total: 3000,
    },
    {
        id: 5,
        name: "Emma Jones",
        email: "emma.jones@email.com",
        image: ProfileImage,
        total: 2500,
    },
    {
        id: 6,
        name: "William Taylor",
        email: "william.taylor@email.com",
        image: ProfileImage,
        total: 4500,
    },
    {
        id: 7,
        name: "Isabella Johnson",
        email: "isabella.johnson@email.com",
        image: ProfileImage,
        total: 5300,
    },
];

export const topProducts = [
    {
        number: 1,
        name: "Wireless Headphones",
        image: ProductImage,
        description: "High-quality noise-canceling wireless headphones.",
        price: 99.99,
        status: "In Stock",
        rating: 4.5,
    },
    {
        number: 2,
        name: "Smartphone",
        image: ProductImage,
        description: "Latest 5G smartphone with excellent camera features.",
        price: 799.99,
        status: "In Stock",
        rating: 4.7,
    },
    {
        number: 3,
        name: "Gaming Laptop",
        image: ProductImage,
        description: "Powerful gaming laptop with high-end graphics.",
        price: 1299.99,
        status: "In Stock",
        rating: 4.8,
    },
    {
        number: 4,
        name: "Smartwatch",
        image: ProductImage,
        description: "Stylish smartwatch with fitness tracking features.",
        price: 199.99,
        status: "Out of Stock",
        rating: 4.4,
    },
    {
        number: 5,
        name: "Bluetooth Speaker",
        image: ProductImage,
        description: "Portable Bluetooth speaker with deep bass sound.",
        price: 59.99,
        status: "In Stock",
        rating: 4.3,
    },
    {
        number: 6,
        name: "4K Monitor",
        image: ProductImage,
        description: "Ultra HD 4K monitor with stunning color accuracy.",
        price: 399.99,
        status: "In Stock",
        rating: 4.6,
    },
    {
        number: 7,
        name: "Mechanical Keyboard",
        image: ProductImage,
        description: "Mechanical keyboard with customizable RGB lighting.",
        price: 89.99,
        status: "In Stock",
        rating: 4.7,
    },
    {
        number: 8,
        name: "Wireless Mouse",
        image: ProductImage,
        description: "Ergonomic wireless mouse with precision tracking.",
        price: 49.99,
        status: "In Stock",
        rating: 4.5,
    },
    {
        number: 9,
        name: "Action Camera",
        image: ProductImage,
        description: "Waterproof action camera with 4K video recording.",
        price: 249.99,
        status: "In Stock",
        rating: 4.8,
    },
    {
        number: 10,
        name: "External Hard Drive",
        image: ProductImage,
        description: "Portable 2TB external hard drive for data storage.",
        price: 79.99,
        status: "Out of Stock",
        rating: 4.5,
    },
];
