import { useEffect, useState } from "react";
import "./App.css";

/* =========================================
   ICONS
========================================= */

function BoxIcon() {
  return (
    <svg viewBox="0 0 24 24" className="box-svg">
      <path d="M4 8.5 12 4l8 4.5-8 4.5L4 8.5Z" />
      <path d="M4 8.5V16l8 4 8-4V8.5" />
      <path d="M12 13v7" />
    </svg>
  );
}

function BookmarkIcon() {
  return (
    <svg viewBox="0 0 24 24" className="bookmark-svg">
      <path d="M6 4.5A2.5 2.5 0 0 1 8.5 2h7A2.5 2.5 0 0 1 18 4.5V21l-6-3.8L6 21V4.5Z" />
    </svg>
  );
}

function EmptyIcon() {
  return (
    <svg viewBox="0 0 80 80" className="empty-svg">
      <path d="M16 30h48v32H16z" />
      <path d="M16 30 24 18h32l8 12" />
      <path d="M16 30h17l3 6h12l3-6h13" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" className="plus-svg">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" className="edit-svg">
      <path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4Z" />
      <path d="m13.5 6.5 4 4" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" className="trash-svg">
      <path d="M4 7h16" />
      <path d="M9 7V4h6v3" />
      <path d="M7 7l1 13h8l1-13" />
      <path d="M10 11v5M14 11v5" />
    </svg>
  );
}

/* =========================================
   APP
========================================= */

function App() {
  /* =========================================
     AVAILABLE ITEMS
  ========================================= */

  const [available, setAvailable] = useState(() => {
    try {
      const savedAvailable =
        localStorage.getItem("availableItems");

      return savedAvailable
        ? JSON.parse(savedAvailable)
        : [];
    } catch (error) {
      console.error(
        "Error loading available items:",
        error
      );

      return [];
    }
  });

  /* =========================================
     SELECTED ITEMS
  ========================================= */

  const [selected, setSelected] = useState(() => {
    try {
      const savedSelected =
        localStorage.getItem("selectedItems");

      return savedSelected
        ? JSON.parse(savedSelected)
        : [];
    } catch (error) {
      console.error(
        "Error loading selected items:",
        error
      );

      return [];
    }
  });

  /* =========================================
     TEMPORARY SELECTION
  ========================================= */

  const [selectedLeft, setSelectedLeft] =
    useState([]);

  const [selectedRight, setSelectedRight] =
    useState([]);

  /* =========================================
     MODAL
  ========================================= */

  const [showModal, setShowModal] =
    useState(false);

  const [itemName, setItemName] =
    useState("");

  /* =========================================
     EDIT MODE
  ========================================= */

  const [editingItem, setEditingItem] =
    useState(null);

  /* =========================================
     SAVE AVAILABLE ITEMS
  ========================================= */

  useEffect(() => {
    try {
      localStorage.setItem(
        "availableItems",
        JSON.stringify(available)
      );
    } catch (error) {
      console.error(
        "Error saving available items:",
        error
      );
    }
  }, [available]);

  /* =========================================
     SAVE SELECTED ITEMS
  ========================================= */

  useEffect(() => {
    try {
      localStorage.setItem(
        "selectedItems",
        JSON.stringify(selected)
      );
    } catch (error) {
      console.error(
        "Error saving selected items:",
        error
      );
    }
  }, [selected]);

  /* =========================================
     OPEN ADD MODAL
  ========================================= */

  const openAddModal = () => {
    setEditingItem(null);
    setItemName("");
    setShowModal(true);
  };

  /* =========================================
     OPEN EDIT MODAL
  ========================================= */

  const openEditModal = (item) => {
    setEditingItem(item);
    setItemName(item.name);
    setShowModal(true);
  };

  /* =========================================
     ADD / UPDATE ITEM
  ========================================= */

  const handleSubmit = (e) => {
    e.preventDefault();

    const name = itemName.trim();

    if (!name) return;

    /* =====================================
       EDIT EXISTING ITEM
    ===================================== */

    if (editingItem) {
      setAvailable((prev) =>
        prev.map((item) =>
          item.id === editingItem.id
            ? {
                ...item,
                name: name,
              }
            : item
        )
      );

      setSelected((prev) =>
        prev.map((item) =>
          item.id === editingItem.id
            ? {
                ...item,
                name: name,
              }
            : item
        )
      );
    }

    /* =====================================
       ADD NEW ITEM
    ===================================== */

    else {
      const newItem = {
        id: Date.now(),
        name: name,
      };

      setAvailable((prev) => [
        ...prev,
        newItem,
      ]);
    }

    closeModal();
  };

  /* =========================================
     SELECT LEFT ITEM
  ========================================= */

  const toggleLeft = (id) => {
    setSelectedLeft((prev) =>
      prev.includes(id)
        ? prev.filter(
            (itemId) => itemId !== id
          )
        : [...prev, id]
    );
  };

  /* =========================================
     SELECT RIGHT ITEM
  ========================================= */

  const toggleRight = (id) => {
    setSelectedRight((prev) =>
      prev.includes(id)
        ? prev.filter(
            (itemId) => itemId !== id
          )
        : [...prev, id]
    );
  };

  /* =========================================
     MOVE LEFT → RIGHT
  ========================================= */

  const moveRight = () => {
    if (selectedLeft.length === 0) {
      return;
    }

    const itemsToMove =
      available.filter((item) =>
        selectedLeft.includes(item.id)
      );

    setSelected((prev) => [
      ...prev,
      ...itemsToMove,
    ]);

    setAvailable((prev) =>
      prev.filter(
        (item) =>
          !selectedLeft.includes(item.id)
      )
    );

    setSelectedLeft([]);
  };

  /* =========================================
     MOVE RIGHT → LEFT
  ========================================= */

  const moveLeft = () => {
    if (selectedRight.length === 0) {
      return;
    }

    const itemsToMove =
      selected.filter((item) =>
        selectedRight.includes(item.id)
      );

    setAvailable((prev) => [
      ...prev,
      ...itemsToMove,
    ]);

    setSelected((prev) =>
      prev.filter(
        (item) =>
          !selectedRight.includes(item.id)
      )
    );

    setSelectedRight([]);
  };

  /* =========================================
     DELETE AVAILABLE ITEM
  ========================================= */

  const deleteAvailableItem = (id) => {
    setAvailable((prev) =>
      prev.filter(
        (item) => item.id !== id
      )
    );

    setSelectedLeft((prev) =>
      prev.filter(
        (itemId) => itemId !== id
      )
    );
  };

  /* =========================================
     DELETE SELECTED ITEM
  ========================================= */

  const deleteSelectedItem = (id) => {
    setSelected((prev) =>
      prev.filter(
        (item) => item.id !== id
      )
    );

    setSelectedRight((prev) =>
      prev.filter(
        (itemId) => itemId !== id
      )
    );
  };

  /* =========================================
     CLOSE MODAL
  ========================================= */

  const closeModal = () => {
    setShowModal(false);
    setItemName("");
    setEditingItem(null);
  };

  return (
    <div className="app">

      {/* Background */}
      <div className="background-shape shape-blue" />
      <div className="background-shape shape-purple" />
      <div className="background-shape shape-orange" />

      <main className="transfer-wrapper">

        {/* =====================================
            LEFT CARD
        ===================================== */}

        <section className="transfer-card left-card">

          {/* Header */}
          <div className="card-header">

            <div className="header-left">

              <div className="header-icon blue-icon">
                <BoxIcon />
              </div>

              <div>
                <h1>
                  Available Items
                </h1>

                <p>
                  Add and select your items
                </p>
              </div>

            </div>

            <div className="count-badge blue-badge">

              <strong>
                {available.length}
              </strong>

              <span>
                items
              </span>

            </div>

          </div>

          {/* Add Button */}
          <button
            className="add-item-button"
            onClick={openAddModal}
          >
            <PlusIcon />

            <span>
              Add New Item
            </span>
          </button>

          {/* Items */}
          <div className="items-list">

            {available.length > 0 ? (

              available.map((item) => {

                const isSelected =
                  selectedLeft.includes(
                    item.id
                  );

                return (
                  <div
                    key={item.id}
                    className={`item ${
                      isSelected
                        ? "selected-item"
                        : ""
                    }`}
                    onClick={() =>
                      toggleLeft(item.id)
                    }
                  >

                    {/* Checkbox */}
                    <span
                      className={`checkbox ${
                        isSelected
                          ? "checked"
                          : ""
                      }`}
                    >
                      {isSelected && "✓"}
                    </span>

                    {/* Item Name */}
                    <span className="item-info">
                      <strong>
                        {item.name}
                      </strong>
                    </span>

                    {/* Actions */}
                    <span className="item-actions">

                      {/* Edit */}
                      <span
                        className="action-button edit-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(item);
                        }}
                        title="Edit item"
                      >
                        <EditIcon />
                      </span>

                      {/* Delete */}
                      <span
                        className="action-button delete-button"
                        onClick={(e) => {
                          e.stopPropagation();

                          deleteAvailableItem(
                            item.id
                          );
                        }}
                        title="Delete item"
                      >
                        <TrashIcon />
                      </span>

                    </span>

                  </div>
                );
              })

            ) : (

              <div className="empty-state">

                <div className="empty-circle">
                  <EmptyIcon />
                </div>

                <h2>
                  No items yet
                </h2>

                <p>
                  Click "Add New Item"
                  <br />
                  to create your first item
                </p>

              </div>

            )}

          </div>

          {/* Footer */}
          <div className="card-footer">

            <span>
              <b className="blue-text">
                {selectedLeft.length}
              </b>{" "}
              selected
            </span>

            <span>
              Total:{" "}
              <b>
                {available.length}
              </b>
            </span>

          </div>

        </section>

        {/* =====================================
            CENTER ARROWS
        ===================================== */}

        <div className="arrow-controls">

          <button
            className="move-button"
            disabled={
              selectedLeft.length === 0
            }
            onClick={moveRight}
          >
            →
          </button>

          <button
            className="move-button"
            disabled={
              selectedRight.length === 0
            }
            onClick={moveLeft}
          >
            ←
          </button>

        </div>

        {/* =====================================
            RIGHT CARD
        ===================================== */}

        <section className="transfer-card right-card">

          {/* Header */}
          <div className="card-header">

            <div className="header-left">

              <div className="header-icon pink-icon">
                <BookmarkIcon />
              </div>

              <div>
                <h1>
                  Selected Items
                </h1>

                <p>
                  Items moved from available list
                </p>
              </div>

            </div>

            <div className="count-badge pink-badge">

              <strong>
                {selected.length}
              </strong>

              <span>
                items
              </span>

            </div>

          </div>

          {/* Items */}
          <div className="items-list">

            {selected.length > 0 ? (

              selected.map((item) => {

                const isSelected =
                  selectedRight.includes(
                    item.id
                  );

                return (
                  <div
                    key={item.id}
                    className={`item ${
                      isSelected
                        ? "selected-right"
                        : ""
                    }`}
                    onClick={() =>
                      toggleRight(item.id)
                    }
                  >

                    {/* Checkbox */}
                    <span
                      className={`checkbox ${
                        isSelected
                          ? "checked pink-check"
                          : ""
                      }`}
                    >
                      {isSelected && "✓"}
                    </span>

                    {/* Item Name */}
                    <span className="item-info">
                      <strong>
                        {item.name}
                      </strong>
                    </span>

                    {/* Actions */}
                    <span className="item-actions">

                      {/* Edit */}
                      <span
                        className="action-button edit-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(item);
                        }}
                        title="Edit item"
                      >
                        <EditIcon />
                      </span>

                      {/* Delete */}
                      <span
                        className="action-button delete-button"
                        onClick={(e) => {
                          e.stopPropagation();

                          deleteSelectedItem(
                            item.id
                          );
                        }}
                        title="Delete item"
                      >
                        <TrashIcon />
                      </span>

                    </span>

                  </div>
                );
              })

            ) : (

              <div className="empty-state">

                <div className="empty-circle">
                  <EmptyIcon />
                </div>

                <h2>
                  No items yet
                </h2>

                <p>
                  Select items from the left
                  <br />
                  and move them here
                </p>

              </div>

            )}

          </div>

          {/* Footer */}
          <div className="card-footer">

            <span>
              <b className="pink-text">
                {selectedRight.length}
              </b>{" "}
              selected
            </span>

            <span>
              Total:{" "}
              <b>
                {selected.length}
              </b>
            </span>

          </div>

        </section>

      </main>

      {/* =====================================
          ADD / EDIT MODAL
      ===================================== */}

      {showModal && (

        <div
          className="modal-overlay"
          onClick={closeModal}
        >

          <div
            className="modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* Modal Header */}
            <div className="modal-header">

              <div>

                <h2>
                  {editingItem
                    ? "Edit Item"
                    : "Add New Item"}
                </h2>

                <p>
                  {editingItem
                    ? "Update the item name"
                    : "Enter the name of your item"}
                </p>

              </div>

              <button
                type="button"
                className="close-button"
                onClick={closeModal}
              >
                ×
              </button>

            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>

              <div className="form-group">

                <label>
                  Item Name
                </label>

                <input
                  type="text"
                  placeholder="Enter item name"
                  value={itemName}
                  onChange={(e) =>
                    setItemName(
                      e.target.value
                    )
                  }
                  autoFocus
                />

              </div>

              {/* Actions */}
              <div className="modal-actions">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-button"
                  disabled={
                    !itemName.trim()
                  }
                >
                  {editingItem ? (
                    <EditIcon />
                  ) : (
                    <PlusIcon />
                  )}

                  {editingItem
                    ? "Update Item"
                    : "Add Item"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default App;