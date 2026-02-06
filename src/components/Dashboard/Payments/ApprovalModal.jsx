import React, { useState, useEffect } from "react";
import styles from "./Payments.module.css";
import img from "./../../../images/dummy-img.jpeg"; // Assuming this is a local dummy image
import Loading from "@/components/Loading";
import ErrorModal from "@/components/ErrorModal";
import { useAuth } from "@/Auth";
import ImageZoomModal from "./ImageZoomModal"; // New component for image zoom

function ApprovalModal({ report, changeTrigger }) {
  const { axiosAPI } = useAuth();

  const [error, setError] = useState(null);
  const [loadingIds, setLoadingIds] = useState(new Set());
  const [paymentStatuses, setPaymentStatuses] = useState({});
  const [isImageZoomModalOpen, setIsImageZoomModalOpen] = useState(false);
  const [currentZoomImageUrl, setCurrentZoomImageUrl] = useState(null);

  useEffect(() => {
    if (report && report.paymentRequests) {
      const map = report.paymentRequests.reduce((acc, pr) => {
        acc[pr.paymentRequestId] = pr.approvalStatus;

        return acc;
      }, {});
      setPaymentStatuses(map);
    }
  }, [report]);

  // Dummy payment request data for testing
  const dummyPaymentRequests = [
    {
      paymentRequestId: "dummy-001",
      paymentMode: "UPI",
      transactionReference: "123568900",
      netAmount: "12980",
      paymentProof: img,
      status: "Pending",
    },
    {
      paymentRequestId: "dummy-002",
      paymentMode: "Net Banking",
      transactionReference: "987654321",
      netAmount: "8500",
      paymentProof: img,
      status: "Pending",
    },
  ];

  // Use dummy data for testing (always show dummy data for now)
  const paymentRequestsToShow = report?.paymentRequests || [];

  const handleAction = async (paymentRequestId, action) => {
    setError(null);
    setLoadingIds((prev) => new Set(prev).add(paymentRequestId));

    try {
      const endpoint =
        action === "approve"
          ? `/payment-requests/${paymentRequestId}/approve`
          : `/payment-requests/${paymentRequestId}/reject`;

      await axiosAPI.post(endpoint);

      setPaymentStatuses((prev) => ({
        ...prev,
        [paymentRequestId]: action === "approve" ? "Approved" : "Rejected",
      }));

      changeTrigger(); // refresh parent list
    } catch (e) {
      setError(e.response?.data?.message || "Error updating payment status");
    } finally {
      setLoadingIds((prev) => {
        const next = new Set(prev);
        next.delete(paymentRequestId);
        return next;
      });
    }
  };

  const openImageZoomModal = (imageUrl) => {
    setCurrentZoomImageUrl(imageUrl);
    setIsImageZoomModalOpen(true);
  };

  const closeImageZoomModal = () => {
    setIsImageZoomModalOpen(false);
    setCurrentZoomImageUrl(null);
  };

  if (!report) return null;

  return (
    <>
      <h3 className={`px-3 mdl-title`}>
        Approvals - Sales Order: {report.orderNumber}
      </h3>

      <div className="row m-0 p-0">
        <div className={`col-6 ${styles.longformmdl}`}>
          <label>Customer Name:</label>
          <input
            type="text"
            value={report.customer?.name || "Jagan"}
            readOnly
          />
        </div>
        <div className={`col-6 ${styles.longformmdl}`}>
          <label>Warehouse:</label>
          <input type="text" value={report.warehouse?.name} readOnly />
        </div>
        <div className={`col-6 ${styles.longformmdl}`}>
          <label>Sales Executive:</label>
          <input type="text" value={report.salesExecutive?.name} readOnly />
        </div>
      </div>

      <h4>Payment Requests</h4>
      <div className={styles.paymentsContainer}>
        {paymentRequestsToShow.map((pr) => (
          <div className={styles.paymentCard} key={pr.paymentRequestId}>
            {/* Header */}
            <div className={styles.cardHeader}>
              <span className={styles.paymentMode}>
                {pr.paymentMode?.toUpperCase()}
              </span>
            </div>

            {/* Details */}
            <div className={styles.paymentDetails}>
              <div className={styles.amountRow}>
                <span className={styles.amountLabel}>Amount</span>
                <span className={styles.amountValue}>
                  ₹ {Number(pr.amount || 0).toFixed(2)}
                </span>
              </div>

              {pr.paymentMode?.toLowerCase() !== "cash" && (
                <div className={styles.detailRow}>
                  <span>Transaction Ref</span>
                  <span>{pr.transactionReference || "—"}</span>
                </div>
              )}
            </div>

            {/* Image */}
            <div className={styles.imageWrapper}>
              <img
                src={pr.paymentProof || img}
                alt="Payment Proof"
                onClick={() => openImageZoomModal(pr.paymentProof || img)}
              />
              <span className={styles.imageHint}>Click to view</span>
            </div>

            {/* Status */}
            <div className={styles.statusWrapper}>
              <span
                className={`${styles.statusBadge} ${
                  paymentStatuses[pr.paymentRequestId] === "Approved"
                    ? styles.statusApproved
                    : paymentStatuses[pr.paymentRequestId] === "Rejected"
                      ? styles.statusRejected
                      : styles.statusPending
                }`}
              >
                {paymentStatuses[pr.paymentRequestId] || "Pending"}
              </span>
            </div>

            {/* Actions */}
            <div className={styles.actionButtons}>
              <button
                className={styles.approveBtn}
                disabled={
                  loadingIds.has(pr.paymentRequestId) ||
                  paymentStatuses[pr.paymentRequestId] === "Approved"
                }
                onClick={() => handleAction(pr.paymentRequestId, "approve")}
              >
                Accept
              </button>

              <button
                className={styles.rejectBtn}
                disabled={
                  loadingIds.has(pr.paymentRequestId) ||
                  paymentStatuses[pr.paymentRequestId] === "Rejected"
                }
                onClick={() => handleAction(pr.paymentRequestId, "reject")}
              >
                Decline
              </button>
            </div>
          </div>
        ))}
      </div>

      {error && (
        <ErrorModal
          isOpen={!!error}
          message={error}
          onClose={() => setError(null)}
          // Using global z-index hierarchy for error modal
          // No need for inline z-index as it's handled by global CSS
          className="error-modal-override"
        />
      )}

      {isImageZoomModalOpen && (
        <ImageZoomModal
          imageUrl={currentZoomImageUrl}
          onClose={closeImageZoomModal}
        />
      )}

      {loadingIds.size > 0 && <Loading />}
    </>
  );
}

export default ApprovalModal;
