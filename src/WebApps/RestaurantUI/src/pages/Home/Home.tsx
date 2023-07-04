export default function Home() {
  return (
    <div className="bg-dark p-3">
      <div className="row mx-0 py-3 bg-light">
        <div className="col-sm-8">
          <p>
            Order #88
            <small className="text-muted">Today, 20 Mar 2021, 8:30 AM</small>
          </p>
          <div className="card rounded-3 mb-3">
            <div className="card-body">
              <ul className="nav nav-pills" id="pills-tab" role="tablist">
                <li className="nav-item" role="presentation">
                  <a
                    className="nav-link nav-link-border-solid btn btn-outline btn-flex btn-active-color-primary flex-column flex-stack pt-9 pb-7 page-bg active border border-primary"
                    id="pills-food-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-food"
                    role="tab"
                    aria-controls="pills-food"
                    aria-selected="true"
                  >
                    <div className="nav-icon mb-3">
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/2082/2082063.png"
                        className="  w-25px"
                        style={{ width: 25 }}
                        alt=""
                      />
                    </div>
                    <div className="">
                      <span className="text-gray-800 fw-bold fs-2 d-block">
                        Dessert
                      </span>
                      <span className="text-gray-400 fw-semibold fs-7">
                        8 Desserts
                      </span>
                    </div>
                  </a>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link rounded-pill"
                    id="pills-drink-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-drink"
                    type="button"
                    role="tab"
                    aria-controls="pills-drink"
                    aria-selected="false"
                  >
                    DRINK
                  </button>
                </li>

                {/* <li className="nav-item" role="presentation">
                  <button
                    className="nav-link rounded-pill"
                    id="pills-checkout-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-checkout"
                    type="button"
                    role="tab"
                    aria-controls="pills-checkout"
                    aria-selected="false"
                  >
                    CHECK OUT
                  </button>
                </li> */}
              </ul>
            </div>
          </div>
          <div className="tab-content" id="pills-tabContent">
            <div
              className="tab-pane fade show active"
              id="pills-food"
              role="tabpanel"
              aria-labelledby="pills-food-tab"
            >
              <div className="row row-cols-1 row-cols-md-4 g-4">
                <div className="col">
                  <div className="card h-100 text-center">
                    <img
                      draggable="false"
                      src="https://static.vecteezy.com/system/resources/previews/003/170/825/original/isolated-food-plate-fork-and-spoon-design-free-vector.jpg"
                      className="card-img-top"
                      alt="..."
                    />
                    {/* <div className="card-body">
                      <h5 className="card-title">Pizza 1</h5>
                    </div> */}
                    <div className="mb-2">
                      <div className="text-center">
                        <span className="fw-bold text-gray-800 cursor-pointer text-hover-primary  fs-3 fs-xl-1">
                          Pancakes
                        </span>
                      </div>
                      <span className="text-success text-end fw-bold fs-1">
                        $ 9.00
                      </span>
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="card h-100">
                    <img
                      draggable="false"
                      src="https://static.vecteezy.com/system/resources/previews/003/170/825/original/isolated-food-plate-fork-and-spoon-design-free-vector.jpg"
                      className="card-img-top"
                      alt="..."
                    />
                    <div className="card-body">
                      <h5 className="card-title">Pizza 2</h5>
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="card h-100">
                    <img
                      draggable="false"
                      src="https://static.vecteezy.com/system/resources/previews/003/170/825/original/isolated-food-plate-fork-and-spoon-design-free-vector.jpg"
                      className="card-img-top"
                      alt="..."
                    />
                    <div className="card-body">
                      <h5 className="card-title">Pizza 3</h5>
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="card h-100">
                    <img
                      draggable="false"
                      src="https://static.vecteezy.com/system/resources/previews/003/170/825/original/isolated-food-plate-fork-and-spoon-design-free-vector.jpg"
                      className="card-img-top"
                      alt="..."
                    />
                    <div className="card-body">
                      <h5 className="card-title">Pizza 4</h5>
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="card h-100">
                    <img
                      draggable="false"
                      src="https://static.vecteezy.com/system/resources/previews/003/170/825/original/isolated-food-plate-fork-and-spoon-design-free-vector.jpg"
                      className="card-img-top"
                      alt="..."
                    />
                    <div className="card-body">
                      <h5 className="card-title">Pizza 5</h5>
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="card h-100">
                    <img
                      draggable="false"
                      src="https://static.vecteezy.com/system/resources/previews/003/170/825/original/isolated-food-plate-fork-and-spoon-design-free-vector.jpg"
                      className="card-img-top"
                      alt="..."
                    />
                    <div className="card-body">
                      <h5 className="card-title">Pizza 6</h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade"
              id="pills-drink"
              role="tabpanel"
              aria-labelledby="pills-drink-tab"
            >
              <div className="row row-cols-1 row-cols-md-4 g-4">
                <div className="col">
                  <div className="card">
                    <img
                      draggable="false"
                      src="https://static.vecteezy.com/system/resources/previews/003/170/825/original/isolated-food-plate-fork-and-spoon-design-free-vector.jpg"
                      className="card-img-top"
                      alt="..."
                    />
                    <div className="card-body">
                      <h5 className="card-title">Pizza 1</h5>
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="card">
                    <img
                      src="https://static.vecteezy.com/system/resources/previews/003/170/825/original/isolated-food-plate-fork-and-spoon-design-free-vector.jpg"
                      className="card-img-top"
                      alt="..."
                    />
                    <div className="card-body">
                      <h5 className="card-title">Pizza 1</h5>
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="card">
                    <img
                      src="https://static.vecteezy.com/system/resources/previews/003/170/825/original/isolated-food-plate-fork-and-spoon-design-free-vector.jpg"
                      className="card-img-top"
                      alt="..."
                    />
                    <div className="card-body">
                      <h5 className="card-title text-truncate ">
                        Orange Juice mkhkjhkhkj
                      </h5>
                      <p className="card-text fw-bold">$ 9.00</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="tab-pane fade"
              id="pills-checkout"
              role="tabpanel"
              aria-labelledby="pills-checkout-tab"
            >
              CHECK OUT
              <div className="row mb-3">
                <label
                  htmlFor="colFormLabelLg"
                  className="col-sm-4 col-form-label col-form-label-lg"
                >
                  Customer Name
                </label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    className="rounded-pill text-center form-control form-control-lg"
                    id="customerName"
                    placeholder="OR#88"
                  />
                </div>
              </div>
              <div className="row mb-3">
                <label
                  htmlFor="colFormLabelLg"
                  className="col-sm-4 col-form-label col-form-label-lg"
                >
                  Amount
                </label>
                <div className="col-sm-8">
                  <input
                    type="number"
                    step="0.01"
                    className="rounded-pill text-center form-control form-control-lg"
                    id="customerName"
                    placeholder="Amount"
                    disabled
                  />
                </div>
              </div>
              <div className="row mb-3">
                <label
                  htmlFor="colFormLabelLg"
                  className="col-sm-4 col-form-label col-form-label-lg"
                >
                  Customer Paid
                </label>
                <div className="col-sm-8">
                  <button
                    className=" rounded-pill btn btn-dark btn-lg w-100"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                  >
                    Insert Paid Amount
                  </button>
                </div>
              </div>
              <div className="row mb-3">
                <label
                  htmlFor="colFormLabelLg"
                  className="col-sm-4 col-form-label col-form-label-lg"
                >
                  Amount Customer Paid
                </label>
                <div className="col-sm-8">
                  <input
                    type="number"
                    step="0.01"
                    className="rounded-pill text-center form-control form-control-lg"
                    id="customerName"
                    placeholder="Amount"
                    disabled
                  />
                </div>
              </div>
              <div className="row mb-3">
                <label
                  htmlFor="colFormLabelLg"
                  className="col-sm-4 col-form-label col-form-label-lg"
                >
                  Change
                </label>
                <div className="col-sm-8">
                  <input
                    type="number"
                    step="0.01"
                    className="rounded-pill text-center form-control form-control-lg text-danger fw-bold"
                    id="customerName"
                    placeholder="Change"
                    disabled
                  />
                </div>
              </div>
              <div className="row mb-3">
                <label
                  htmlFor="colFormLabelLg"
                  className="col-sm-4 col-form-label col-form-label-lg"
                >
                  Print Receipt
                </label>
                <div className="col-sm-8">
                  <button className="btn btn-dark btn-lg w-100 rounded-pill">
                    Print Receipt
                  </button>
                </div>
              </div>
              <div className="row mb-3">
                <label
                  htmlFor="colFormLabelLg"
                  className="col-sm-4 col-form-label col-form-label-lg"
                >
                  Next Customer
                </label>
                <div className="col-sm-8">
                  <button className="btn btn-primary btn-lg w-100 rounded-pill">
                    Next Customer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-4">
          <div className="card">
            <div className="card-body">
              <h5 className="d-flex justify-content-between align-items-center">
                <span>Order</span>
                <button className="btn btn-sm btn-danger rounded-pill">
                  Clear
                </button>
              </h5>
              <hr />
              <ul
                className="list-unstyled"
                style={{ height: "50vh", overflow: "auto" }}
              >
                <li>
                  <span className="d-flex justify-content-between align-items-center">
                    <span>
                      <img
                        src="https://static.vecteezy.com/system/resources/previews/003/170/825/original/isolated-food-plate-fork-and-spoon-design-free-vector.jpg"
                        className="rounded border border-dark "
                        style={{ width: "50px" }}
                      />
                      {/* routing border border-dark */}
                      <span>Coke</span>{" "}
                      <span className="text-danger"> $ 1.99</span>
                    </span>
                    <button className="btn btn-danger rounded-pill">X</button>
                  </span>
                  <button className="btn-sm btn btn-success rounded-pill px-3 fw-bold">
                    +
                  </button>
                  <span className="px-3 fw-bold">6</span>
                  <button className="btn-sm btn btn-danger rounded-pill px-3 ms-1 fw-bold">
                    -
                  </button>
                </li>
              </ul>

              <hr />

              <ul className="list-unstyled mb-0">
                <li className="d-flex justify-content-between align-items-center">
                  <big>Total Items:</big>
                  <big className="fw-bold">
                    <span className="card-text"> 10</span>
                  </big>
                </li>

                <li className="d-flex justify-content-between align-items-center">
                  <big>Total:</big>{" "}
                  <big className="fw-bold">
                    $ <span className="card-text"> 10</span>
                  </big>
                </li>
                <li>
                  <hr />
                  <button className="btn btn-primary btn-lg rounded-pill w-100">
                    CHECK OUT
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="exampleModal"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-body">
              <input
                type="text"
                className="mb-3 bg-dark w-100 text-end form-control form-control-lg text-white"
              />
              <div className="row">
                <div className="col-4 mb-3">
                  <button className="btn w-100 rounded-pill text-center btn-outline-dark">
                    9
                  </button>
                </div>
                <div className="col-4 mb-3">
                  <button className="btn w-100 rounded-pill text-center btn-outline-dark">
                    8
                  </button>
                </div>
                <div className="col-4 mb-3">
                  <button className="btn w-100 rounded-pill text-center btn-outline-dark">
                    7
                  </button>
                </div>
                <div className="col-4 mb-3">
                  <button className="btn w-100 rounded-pill text-center btn-outline-dark">
                    6
                  </button>
                </div>
                <div className="col-4 mb-3">
                  <button className="btn w-100 rounded-pill text-center btn-outline-dark">
                    5
                  </button>
                </div>
                <div className="col-4 mb-3">
                  <button className="btn w-100 rounded-pill text-center btn-outline-dark">
                    4
                  </button>
                </div>
                <div className="col-4 mb-3">
                  <button className="btn w-100 rounded-pill text-center btn-outline-dark">
                    3
                  </button>
                </div>
                <div className="col-4 mb-3">
                  <button className="btn w-100 rounded-pill text-center btn-outline-dark">
                    2
                  </button>
                </div>
                <div className="col-4 mb-3">
                  <button className="btn w-100 rounded-pill text-center btn-outline-dark">
                    1
                  </button>
                </div>
                <div className="col-4 mb-3">
                  <button className="btn w-100 rounded-pill text-center btn-outline-dark">
                    0
                  </button>
                </div>

                <div className="col-4 mb-3">
                  <button className="btn w-100 rounded-pill text-center btn-outline-dark">
                    00
                  </button>
                </div>

                <div className="col-4 mb-3">
                  <button className="btn w-100 rounded-pill text-center btn-outline-dark">
                    .
                  </button>
                </div>

                <div className="col-4 mb-3">
                  <button className="btn w-100 rounded-pill text-center btn-danger">
                    C
                  </button>
                </div>
              </div>
            </div>

            <div className="modal-body">
              <div className="row">
                <div className="col-12 mb-3">
                  <button className="btn w-100 rounded-pill text-center btn-warning">
                    Exact Amount
                  </button>
                </div>
              </div>
              <div className="row">
                <div className="col-2 mb-3">
                  <button className="btn w-100 rounded-pill text-center btn-warning">
                    1
                  </button>
                </div>
                <div className="col-2 mb-3">
                  <button className="btn w-100 rounded-pill text-center btn-warning">
                    5
                  </button>
                </div>
                <div className="col-2 mb-3">
                  <button className="btn w-100 rounded-pill text-center btn-warning">
                    10
                  </button>
                </div>
                <div className="col-2 mb-3">
                  <button className="btn w-100 rounded-pill text-center btn-warning">
                    20
                  </button>
                </div>
                <div className="col-2 mb-3">
                  <button className="btn w-100 rounded-pill text-center btn-warning">
                    50
                  </button>
                </div>
                <div className="col-2 mb-3">
                  <button className="btn w-100 rounded-pill text-center btn-warning">
                    100
                  </button>
                </div>
                di
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button type="button" className="btn btn-primary">
                Confirmar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* <Breadcrumbs title="Home" /> */}
      {/* <div className="home">
                <div class="row"> 
                    <div class="col-lg-3 col-md-6">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">TOTAL VISIT</h5>
                                <div class="d-flex no-block align-items-center m-t-20 m-b-20">
                                    <div id="sparklinedash"></div>
                                    <div class="ms-auto">
                                        <h2 class="text-success"><i class="ti-arrow-up"></i> <span class="counter">8659</span></h2>
                                    </div>
                                </div>
                            </div>
                            <div id="sparkline8" class="sparkchart"></div>
                        </div>
                    </div> 
                    <div class="col-lg-3 col-md-6">
                        <div class="card"> 
                            <div class="card-body">
                                <h5 class="card-title">TOTAL PAGE VIEWS</h5>
                                <div class="d-flex no-block align-items-center m-t-20 m-b-20">
                                    <div id="sparklinedash2"></div>
                                    <div class="ms-auto">
                                        <h2 class="text-purple"><i class="ti-arrow-up"></i> <span class="counter">7469</span></h2>
                                    </div>
                                </div>
                            </div>
                            <div id="sparkline8" class="sparkchart"></div>
                        </div>
                    </div> 
                    <div class="col-lg-3 col-md-6">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">UNIQUE VISITOR</h5>
                                <div class="d-flex no-block align-items-center m-t-20 m-b-20">
                                    <div id="sparklinedash3"></div>
                                    <div class="ms-auto">
                                        <h2 class="text-info"><i class="ti-arrow-up"></i> <span class="counter">6011</span></h2>
                                    </div>
                                </div>
                            </div>
                            <div id="sparkline8" class="sparkchart"></div>
                        </div>
                    </div> 
                    <div class="col-lg-3 col-md-6">
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">BOUNCE RATE</h5>
                                <div class="d-flex no-block align-items-center m-t-20 m-b-20">
                                    <div id="sparklinedash4"></div>
                                    <div class="ms-auto">
                                        <h2 class="text-danger"><i class="ti-arrow-down"></i> <span class="counter">18%</span></h2>
                                    </div>
                                </div>
                            </div>
                            <div id="sparkline8" class="sparkchart"></div>
                        </div>
                    </div> 
                </div>
            </div> */}
    </div>
  );
}
