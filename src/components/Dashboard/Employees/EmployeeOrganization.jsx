import React, { useEffect, useState } from "react";
import { useAuth } from "@/Auth";
import Loading from "@/components/Loading";
import ErrorModal from "@/components/ErrorModal";
import OrganizationTree from "./OrganizationTree";
import styles from "./Employees.module.css";

function EmployeeOrganization({ navigate }) {
  const { axiosAPI } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hierarchy, setHierarchy] = useState([]);
  const [statistics, setStatistics] = useState(null);
  
  // Filter states
  const [divisions, setDivisions] = useState([]);
  const [zones, setZones] = useState([]);
  const [subzones, setSubzones] = useState([]);
  const [teams, setTeams] = useState([]);
  const [roles, setRoles] = useState([]);
  
  // Selected filters
  const [selectedDivision, setSelectedDivision] = useState("");
  const [selectedZone, setSelectedZone] = useState("");
  const [selectedSubzone, setSelectedSubzone] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  
  // Employee detail modal state
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedEmployee(null);
    setEmployeeDetails(null);
  };

  // Fetch employee details
  const fetchEmployeeDetails = async (employeeId) => {
    try {
      setLoadingDetails(true);
      const res = await axiosAPI.get(`/organization-hierarchy/employee/${employeeId}`);
      if (res.data && res.data.success && res.data.data) {
        setEmployeeDetails(res.data.data);
        setIsDetailModalOpen(true);
      }
    } catch (err) {
      console.error("Failed to fetch employee details:", err);
      setError(err?.response?.data?.message || "Failed to load employee details");
      setIsModalOpen(true);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleEmployeeClick = (employee) => {
    if (employee.id) {
      fetchEmployeeDetails(employee.id);
    }
  };

  // Fetch all filters from single endpoint
  const fetchAllFilters = async () => {
    try {
      const res = await axiosAPI.get("/hierarchy/filters");
      if (res.data && res.data.success && res.data.data) {
        const filters = res.data.data;
        // Set divisions
        if (filters.divisions && Array.isArray(filters.divisions)) {
          setDivisions(filters.divisions);
        }
        // Set roles
        if (filters.roles && Array.isArray(filters.roles)) {
          setRoles(filters.roles);
        }
        // Note: zones, subzones, teams will be fetched dynamically based on selections
      } else if (res.data) {
        // Handle direct response
        if (res.data.divisions && Array.isArray(res.data.divisions)) {
          setDivisions(res.data.divisions);
        }
        if (res.data.roles && Array.isArray(res.data.roles)) {
          setRoles(res.data.roles);
        }
      }
    } catch (err) {
      console.error("Failed to fetch filters:", err);
      // Fallback to individual endpoints
      fetchDivisionsFallback();
      fetchRolesFallback();
    }
  };

  // Fallback: Fetch divisions
  const fetchDivisionsFallback = async () => {
    try {
      const res = await axiosAPI.get("/divisions");
      if (res.data && res.data.success && res.data.data) {
        setDivisions(Array.isArray(res.data.data) ? res.data.data : []);
      } else if (Array.isArray(res.data)) {
        setDivisions(res.data);
      } else {
        setDivisions([]);
      }
    } catch (err) {
      console.error("Failed to fetch divisions:", err);
      setDivisions([]);
    }
  };

  // Fetch zones
  const fetchZones = async (divisionId = null) => {
    try {
      let endpoint = "/zones";
      if (divisionId) {
        endpoint += `?divisionId=${divisionId}`;
      }
      const res = await axiosAPI.get(endpoint);
      
      // Handle nested structure: data.data.zones
      if (res.data && res.data.success && res.data.data) {
        if (res.data.data.zones && Array.isArray(res.data.data.zones)) {
          setZones(res.data.data.zones);
        } else if (Array.isArray(res.data.data)) {
          setZones(res.data.data);
        } else {
          setZones([]);
        }
      } else if (res.data && res.data.zones && Array.isArray(res.data.zones)) {
        // Handle direct zones array in data
        setZones(res.data.zones);
      } else if (Array.isArray(res.data)) {
        setZones(res.data);
      } else {
        setZones([]);
      }
    } catch (err) {
      console.error("Failed to fetch zones:", err);
      setZones([]);
    }
  };

  // Fetch subzones
  const fetchSubzones = async (zoneId) => {
    try {
      const res = await axiosAPI.get(`/subzones?zoneId=${zoneId}`);
      
      // Handle nested structure: data.data.subzones
      if (res.data && res.data.success && res.data.data) {
        if (res.data.data.subzones && Array.isArray(res.data.data.subzones)) {
          setSubzones(res.data.data.subzones);
        } else if (Array.isArray(res.data.data)) {
          setSubzones(res.data.data);
        } else {
          setSubzones([]);
        }
      } else if (res.data && res.data.subzones && Array.isArray(res.data.subzones)) {
        setSubzones(res.data.subzones);
      } else if (Array.isArray(res.data)) {
        setSubzones(res.data);
      } else {
        setSubzones([]);
      }
    } catch (err) {
      // Handle 404 gracefully - endpoint might not exist or be implemented yet
      if (err.response && err.response.status === 404) {
        console.warn("Subzones endpoint not available (404). This feature may not be implemented yet.");
        setSubzones([]);
      } else {
        console.error("Failed to fetch subzones:", err);
        setSubzones([]);
      }
    }
  };

  // Fetch teams
  const fetchTeams = async (subZoneId) => {
    try {
      const res = await axiosAPI.get(`/teams?subZoneId=${subZoneId}`);
      
      // Handle nested structure: data.data.teams
      if (res.data && res.data.success && res.data.data) {
        if (res.data.data.teams && Array.isArray(res.data.data.teams)) {
          setTeams(res.data.data.teams);
        } else if (Array.isArray(res.data.data)) {
          setTeams(res.data.data);
        } else {
          setTeams([]);
        }
      } else if (res.data && res.data.teams && Array.isArray(res.data.teams)) {
        setTeams(res.data.teams);
      } else if (Array.isArray(res.data)) {
        setTeams(res.data);
      } else {
        setTeams([]);
      }
    } catch (err) {
      // Handle 404 gracefully - endpoint might not exist
      if (err.response && err.response.status === 404) {
        console.warn("Teams endpoint not available (404). This feature may not be implemented yet.");
        setTeams([]);
      } else {
        console.error("Failed to fetch teams:", err);
        setTeams([]);
      }
    }
  };

  // Fallback: Fetch roles
  const fetchRolesFallback = async () => {
    try {
      const res = await axiosAPI.get("/employees/roles");
      if (res.data && res.data.success && res.data.data) {
        setRoles(Array.isArray(res.data.data) ? res.data.data : []);
      } else if (Array.isArray(res.data)) {
        setRoles(res.data);
      } else {
        setRoles([]);
      }
    } catch (err) {
      console.error("Failed to fetch roles:", err);
      setRoles([]);
    }
  };

  // Fetch organization hierarchy
  const fetchHierarchy = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get division context from localStorage
      const currentDivisionId = localStorage.getItem('currentDivisionId');
      
      // Build query parameters
      const params = new URLSearchParams();
      if (selectedDivision) {
        if (selectedDivision === 'all') {
          params.append('divisionId', 'all');
        } else {
          params.append('divisionId', selectedDivision);
        }
      } else if (currentDivisionId && currentDivisionId !== '1') {
        params.append('divisionId', currentDivisionId);
      } else if (currentDivisionId === '1') {
        params.append('divisionId', 'all');
      }
      if (selectedZone) params.append('zoneId', selectedZone);
      if (selectedSubzone) params.append('subZoneId', selectedSubzone);
      if (selectedTeam) params.append('teamId', selectedTeam);
      if (selectedRole) params.append('roleId', selectedRole);
      
      const queryString = params.toString();
      const endpoint = queryString 
        ? `/organization-hierarchy?${queryString}`
        : '/organization-hierarchy';
      
      const res = await axiosAPI.get(endpoint);
      
      // Handle the nested response structure
      if (res.data && res.data.success && res.data.data) {
        const responseData = res.data.data;
        
        // Extract hierarchy from nested structure
        if (responseData.hierarchy && responseData.hierarchy.hierarchy) {
          setHierarchy(Array.isArray(responseData.hierarchy.hierarchy) 
            ? responseData.hierarchy.hierarchy 
            : []);
        } else if (responseData.hierarchy && Array.isArray(responseData.hierarchy)) {
          setHierarchy(responseData.hierarchy);
        } else {
          setHierarchy([]);
        }
        
        // Extract statistics
        if (responseData.statistics) {
          setStatistics(responseData.statistics);
        }
        
        // Extract available filters and update state
        if (responseData.filters && responseData.filters.available) {
          const filters = responseData.filters.available;
          
          // Update divisions from filters if available
          if (filters.divisions && Array.isArray(filters.divisions)) {
            setDivisions(filters.divisions);
          }
          
          // Update roles from filters if available
          if (filters.roles && Array.isArray(filters.roles)) {
            setRoles(filters.roles);
          }
        }
      } else if (Array.isArray(res.data)) {
        setHierarchy(res.data);
      } else {
        setHierarchy([]);
      }
    } catch (err) {
      console.error("Failed to fetch organization hierarchy:", err);
      setError(err?.response?.data?.message || "Failed to load organization hierarchy");
      setIsModalOpen(true);
      setHierarchy([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics (now included in hierarchy response, but keeping for standalone use)
  const fetchStatistics = async () => {
    try {
      const res = await axiosAPI.get("/organization-hierarchy/statistics");
      if (res.data && res.data.success && res.data.data) {
        setStatistics(res.data.data);
      } else if (res.data && res.data.success && res.data.data && res.data.data.statistics) {
        setStatistics(res.data.data.statistics);
      } else if (res.data) {
        setStatistics(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch statistics:", err);
    }
  };

  // Initial data fetch
  useEffect(() => {
    // Fetch all filters from single endpoint
    fetchAllFilters();
    fetchStatistics();
  }, []);

  // Fetch hierarchy when filters change
  useEffect(() => {
    fetchHierarchy();
  }, [selectedDivision, selectedZone, selectedSubzone, selectedTeam, selectedRole]);

  // Fetch zones when division changes
  useEffect(() => {
    if (selectedDivision && selectedDivision !== 'all') {
      fetchZones(selectedDivision);
      setSelectedZone("");
      setSelectedSubzone("");
      setSelectedTeam("");
    } else if (selectedDivision === 'all') {
      // When "all" is selected, fetch all zones without division filter
      fetchZones();
      setSelectedZone("");
      setSelectedSubzone("");
      setSelectedTeam("");
    } else {
      // No division selected, clear zones
      setZones([]);
      setSelectedZone("");
      setSelectedSubzone("");
      setSelectedTeam("");
    }
  }, [selectedDivision]);

  // Fetch subzones when zone changes
  useEffect(() => {
    if (selectedZone) {
      // Only fetch if zone is selected and is a valid number
      const zoneId = parseInt(selectedZone);
      if (!isNaN(zoneId) && zoneId > 0) {
        fetchSubzones(zoneId);
      } else {
        setSubzones([]);
      }
      setSelectedSubzone("");
      setSelectedTeam("");
    } else {
      setSubzones([]);
      setSelectedSubzone("");
      setSelectedTeam("");
    }
  }, [selectedZone]);

  // Fetch teams when subzone changes
  useEffect(() => {
    if (selectedSubzone) {
      // Only fetch if subzone is selected and is a valid number
      const subZoneId = parseInt(selectedSubzone);
      if (!isNaN(subZoneId) && subZoneId > 0) {
        fetchTeams(subZoneId);
      } else {
        setTeams([]);
      }
      setSelectedTeam("");
    } else {
      setTeams([]);
      setSelectedTeam("");
    }
  }, [selectedSubzone]);

  return (
    <>
      <div className={styles.orgContainer}>
        <div className={styles.orgHeader}>
          <h2>Employee Organization</h2>
        </div>

        {/* Hierarchy Display */}
        <div className={styles.orgContent}>
          {loading ? (
            <Loading />
          ) : hierarchy.length === 0 ? (
            <div className={styles.orgEmpty}>
              <p>No organization data found.</p>
            </div>
          ) : (
            <OrganizationTree data={hierarchy} onNodeClick={handleEmployeeClick} />
          )}
        </div>
      </div>

      <ErrorModal
        isOpen={isModalOpen}
        onClose={closeModal}
        message={error}
      />

      {/* Employee Detail Modal */}
      {isDetailModalOpen && employeeDetails && (
        <div className={styles.employeeDetailModal}>
          <div className={styles.modalOverlay} onClick={closeDetailModal}></div>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Employee Details</h3>
              <button className={styles.closeButton} onClick={closeDetailModal}>×</button>
            </div>
            {loadingDetails ? (
              <Loading />
            ) : (
              <div className={styles.modalBody}>
                <div className={styles.detailSection}>
                  <h4>Basic Information</h4>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Employee ID:</span>
                    <span className={styles.detailValue}>{employeeDetails.employeeId}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Name:</span>
                    <span className={styles.detailValue}>{employeeDetails.name}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Email:</span>
                    <span className={styles.detailValue}>{employeeDetails.email}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Mobile:</span>
                    <span className={styles.detailValue}>{employeeDetails.mobile}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Status:</span>
                    <span className={employeeDetails.status?.toLowerCase() === 'active' ? styles.active : styles.inactive}>
                      {employeeDetails.status}
                    </span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Role:</span>
                    <span className={styles.detailValue}>{employeeDetails.role}</span>
                  </div>
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Role Level:</span>
                    <span className={styles.detailValue}>{employeeDetails.roleLevel}</span>
                  </div>
                </div>

                {employeeDetails.division && (
                  <div className={styles.detailSection}>
                    <h4>Division</h4>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Division:</span>
                      <span className={styles.detailValue}>
                        {typeof employeeDetails.division === 'object' 
                          ? employeeDetails.division.name 
                          : employeeDetails.division}
                      </span>
                    </div>
                    {typeof employeeDetails.division === 'object' && employeeDetails.division.state && (
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>State:</span>
                        <span className={styles.detailValue}>{employeeDetails.division.state}</span>
                      </div>
                    )}
                  </div>
                )}

                {employeeDetails.warehouse && (
                  <div className={styles.detailSection}>
                    <h4>Warehouse</h4>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Warehouse:</span>
                      <span className={styles.detailValue}>
                        {typeof employeeDetails.warehouse === 'object' 
                          ? employeeDetails.warehouse.name 
                          : employeeDetails.warehouse}
                      </span>
                    </div>
                    {typeof employeeDetails.warehouse === 'object' && (
                      <>
                        {employeeDetails.warehouse.city && (
                          <div className={styles.detailRow}>
                            <span className={styles.detailLabel}>City:</span>
                            <span className={styles.detailValue}>{employeeDetails.warehouse.city}</span>
                          </div>
                        )}
                        {employeeDetails.warehouse.state && (
                          <div className={styles.detailRow}>
                            <span className={styles.detailLabel}>State:</span>
                            <span className={styles.detailValue}>{employeeDetails.warehouse.state}</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}

                {employeeDetails.supervisor && (
                  <div className={styles.detailSection}>
                    <h4>Supervisor</h4>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Name:</span>
                      <span className={styles.detailValue}>{employeeDetails.supervisor.name}</span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Employee ID:</span>
                      <span className={styles.detailValue}>{employeeDetails.supervisor.employeeId}</span>
                    </div>
                    {employeeDetails.supervisor.role && (
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>Role:</span>
                        <span className={styles.detailValue}>{employeeDetails.supervisor.role}</span>
                      </div>
                    )}
                    {employeeDetails.supervisor.email && (
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>Email:</span>
                        <span className={styles.detailValue}>{employeeDetails.supervisor.email}</span>
                      </div>
                    )}
                    {employeeDetails.supervisor.mobile && (
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>Mobile:</span>
                        <span className={styles.detailValue}>{employeeDetails.supervisor.mobile}</span>
                      </div>
                    )}
                  </div>
                )}

                {employeeDetails.subordinates && employeeDetails.subordinates.length > 0 && (
                  <div className={styles.detailSection}>
                    <h4>Subordinates ({employeeDetails.subordinates.length})</h4>
                    <div className={styles.subordinatesList}>
                      {employeeDetails.subordinates.map((sub, idx) => (
                        <div key={sub.id || idx} className={styles.subordinateItem}>
                          <div className={styles.subordinateName}>{sub.name}</div>
                          <div className={styles.subordinateDetails}>
                            <span>{sub.employeeId}</span>
                            {sub.role && <span>{sub.role}</span>}
                            {sub.status && (
                              <span className={sub.status.toLowerCase() === 'active' ? styles.active : styles.inactive}>
                                {sub.status}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {employeeDetails.createdAt && (
                  <div className={styles.detailSection}>
                    <h4>Timestamps</h4>
                    <div className={styles.detailRow}>
                      <span className={styles.detailLabel}>Created:</span>
                      <span className={styles.detailValue}>
                        {new Date(employeeDetails.createdAt).toLocaleString()}
                      </span>
                    </div>
                    {employeeDetails.updatedAt && (
                      <div className={styles.detailRow}>
                        <span className={styles.detailLabel}>Updated:</span>
                        <span className={styles.detailValue}>
                          {new Date(employeeDetails.updatedAt).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default EmployeeOrganization;

