import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { CSVLink } from "react-csv";

function ProcManagerDashboard() {
  const navigate = useNavigate();
  const [assets, setAssets] = useState([]);
  const [requests, setRequests] = useState([]);
  const [selectedSection, setSelectedSection] = useState('viewAssets');
  const [newAsset, setNewAsset] = useState({
    asset_name: '',
    description: '',
    category_id: '',
    condition: '',
    status: 'Available',
    department_id: '',
  });
  const [editingAsset, setEditingAsset] = useState(null);

  useEffect(() => {
    if (selectedSection === 'viewAssets' || selectedSection === 'manageAssets') {
      fetchAssets();
    }
    if (selectedSection === 'viewRequests') {
      fetchRequests();
    }
  }, [selectedSection]);

  const fetchAssets = async () => {
    try {
      const response = await axios.get('http://localhost:3000/Assets');
      setAssets(response.data);
    } catch (error) {
      console.error("Error fetching assets:", error);
    }
  };

  const fetchRequests = async () => {
    try {
      const response = await axios.get('http://localhost:3000/Requests');
      setRequests(response.data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  const handleSectionChange = (section) => {
    setSelectedSection(section);
  };

  const handleLogout = () => {
    navigate('/');
  };

  const csvData = assets.map(asset => ({
    Asset_Name: asset.asset_name,
    Description: asset.description,
    Category: asset.category_id,
    Status: asset.status,
    Condition: asset.condition,
    Department: asset.department_id,
  }));

  return (
    <div style={styles.adminDashboard}>
      <div style={styles.sidebar}>
        <h2 style={styles.sidebarTitle}>Procurement Manager Dashboard</h2>
        <ul style={styles.navList}>
          <li style={styles.navItem} onClick={() => handleSectionChange('viewAssets')}>View All Assets</li>
          <li style={styles.navItem} onClick={() => handleSectionChange('viewRequests')}>View Requests</li>
          <li style={styles.navItem} onClick={() => handleSectionChange('manageAssets')}>Manage Assets</li>
          <li style={styles.navItem}>
            <CSVLink data={csvData} filename={"assets_report.csv"} style={styles.downloadLink}>Download Report</CSVLink>
          </li>
        </ul>
        <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
      </div>

      <div style={styles.content}>
        <h1 style={styles.contentTitle}>Procurement Manager Dashboard</h1>

        {selectedSection === 'viewAssets' && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>All Assets</h2>
            <div style={styles.assetGrid}>
              {assets.length > 0 ? (
                assets.map(asset => (
                  <div key={asset.id} style={styles.assetCard}>
                    <img src={asset.image_url} alt={asset.asset_name} style={styles.assetImage} />
                    <h4>{asset.asset_name}</h4>
                    <p>{asset.description}</p>
                    <span>Status: {asset.status}</span>
                  </div>
                ))
              ) : (
                <p>No assets available to display.</p>
              )}
            </div>
          </div>
        )}

        {selectedSection === 'viewRequests' && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>User Requests</h2>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.tableHeader}>Request Type</th>
                  <th style={styles.tableHeader}>Quantity</th>
                  <th style={styles.tableHeader}>Urgency</th>
                  <th style={styles.tableHeader}>Reason</th>
                  <th style={styles.tableHeader}>Status</th>
                  <th style={styles.tableHeader}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request.id}>
                    <td style={styles.tableCell}>{request.request_type}</td>
                    <td style={styles.tableCell}>{request.quantity}</td>
                    <td style={styles.tableCell}>{request.urgency}</td>
                    <td style={styles.tableCell}>{request.reason}</td>
                    <td style={styles.tableCell}>{request.status_id === 1 ? "Pending" : request.status_id === 2 ? "Approved" : "Rejected"}</td>
                    <td style={styles.tableCell}>
                      {request.status_id === 1 && (
                        <>
                          <button onClick={() => handleApprove(request.id)} style={styles.approveButton}>Approve</button>
                          <button onClick={() => handleReject(request.id)} style={styles.rejectButton}>Reject</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedSection === 'manageAssets' && (
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>{editingAsset ? "Edit Asset" : "Add New Asset"}</h2>
            <form onSubmit={editingAsset ? handleUpdateAsset : handleAddAsset} style={styles.form}>
              <input
                type="text"
                placeholder="Asset Name"
                value={editingAsset ? editingAsset.asset_name : newAsset.asset_name}
                onChange={(e) =>
                  editingAsset
                    ? setEditingAsset({ ...editingAsset, asset_name: e.target.value })
                    : setNewAsset({ ...newAsset, asset_name: e.target.value })
                }
                style={styles.input}
              />
              <input
                type="text"
                placeholder="Description"
                value={editingAsset ? editingAsset.description : newAsset.description}
                onChange={(e) =>
                  editingAsset
                    ? setEditingAsset({ ...editingAsset, description: e.target.value })
                    : setNewAsset({ ...newAsset, description: e.target.value })
                }
                style={styles.input}
              />
              <input
                type="text"
                placeholder="Category ID"
                value={editingAsset ? editingAsset.category_id : newAsset.category_id}
                onChange={(e) =>
                  editingAsset
                    ? setEditingAsset({ ...editingAsset, category_id: e.target.value })
                    : setNewAsset({ ...newAsset, category_id: e.target.value })
                }
                style={styles.input}
              />
              <input
                type="text"
                placeholder="Condition"
                value={editingAsset ? editingAsset.condition : newAsset.condition}
                onChange={(e) =>
                  editingAsset
                    ? setEditingAsset({ ...editingAsset, condition: e.target.value })
                    : setNewAsset({ ...newAsset, condition: e.target.value })
                }
                style={styles.input}
              />
              <input
                type="text"
                placeholder="Department ID"
                value={editingAsset ? editingAsset.department_id : newAsset.department_id}
                onChange={(e) =>
                  editingAsset
                    ? setEditingAsset({ ...editingAsset, department_id: e.target.value })
                    : setNewAsset({ ...newAsset, department_id: e.target.value })
                }
                style={styles.input}
              />
              <button type="submit" style={styles.submitButton}>
                {editingAsset ? "Update Asset" : "Add Asset"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  adminDashboard: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f4f6f8',
  },
  sidebar: {
    width: '250px',
    backgroundColor: '#2c3e50',
    color: 'white',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
  },
  sidebarTitle: {
    fontSize: '22px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#ecf0f1',
  },
  navList: {
    listStyleType: 'none',
    padding: 0,
    marginBottom: '20px',
  },
  navItem: {
    padding: '10px 0',
    cursor: 'pointer',
    color: '#bdc3c7',
    transition: 'color 0.2s',
  },
  downloadLink: {
    color: '#3498db',
    textDecoration: 'none',
  },
  logoutButton: {
    padding: '10px 20px',
    backgroundColor: '#e74c3c',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    alignSelf: 'center',
    marginTop: '20px',
  },
  content: {
    flexGrow: 1,
    padding: '20px',
  },
  contentTitle: {
    color: '#34495e',
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '20px',
  },
  section: {
    backgroundColor: '#ecf0f1',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px',
  },
  assetGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
  },
  assetCard: {
    width: '200px',
    backgroundColor: '#fff',
    padding: '10px',
    borderRadius: '8px',
    textAlign: 'center',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  assetImage: {
    width: '100%',
    height: '120px',
    objectFit: 'cover',
    borderRadius: '5px',
    marginBottom: '10px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '10px',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  tableHeader: {
    backgroundColor: '#34495e',
    color: 'white',
    padding: '10px',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '14px',
  },
  tableCell: {
    padding: '10px',
    textAlign: 'center',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #ddd',
    fontSize: '14px',
  },
  approveButton: {
    padding: '5px 10px',
    marginRight: '5px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  rejectButton: {
    padding: '5px 10px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  submitButton: {
    padding: '10px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  input: {
    marginBottom: '10px',
    padding: '8px',
    width: '100%',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
};

export default ProcManagerDashboard;
