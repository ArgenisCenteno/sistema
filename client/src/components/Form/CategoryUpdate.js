import React from "react";

const CategoryUpdate = ({ handleSubmit, value, setValue  }) => {
  

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="mb-3 mr-6">
          <input
            type="text"
            className="form-control"
            placeholder="Ingrese nueva categoría"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-success">
          Editar categoría
        </button>
      </form>

      
    </>
  );
};

export default CategoryUpdate;