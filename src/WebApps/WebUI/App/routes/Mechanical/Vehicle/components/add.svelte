<script lang="ts">
  import toast from "$core/utils/toast";
  import type { Customer } from "$core/interfaces/customer/customer";

  export let customer = {} as Customer;
</script>

<md-card>
  <md-card-content>
    <div class="row">
      <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
        <div class="card">
          <div class="card-body border border-info rounded">
            <div class="card-body">
              <h5 class="card-title">Cliente / Coductor</h5>
              <div class="row">
                <div class="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                  <div class="form-group">
                    <label for="">Razón Social</label>
                    <input
                      type="text"
                      class="form-control"
                      disabled
                      value={customer.businessName}
                    />
                  </div>
                </div>
                <div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-6">
                  <div class="form-group">
                    <label for="">Ruc</label>
                    <input
                      type="text"
                      class="form-control"
                      disabled
                      value={customer.idCard}
                    />
                  </div>
                </div>
                <div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-6">
                  <div class="form-group">
                    <label for="">Email</label>
                    <input
                      type="text"
                      class="form-control"
                      disabled
                      value={customer.email}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-body border border-info rounded">
            <div class="card-body">
              <h5 class="card-title">Vehículo</h5>
              <div class="row">
                <div class="col-xl-3 col-lg-3 col-md-3 col-sm-2 col-6">
                  <div class="form-group">
                    <label for="">Tipo de Vehículo</label>
                    <input
                      type="text"
                      class="form-control"
                      disabled
                      value={customer.businessName}
                    />
                  </div>
                </div>
                <div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-6">
                  <div class="form-group">
                    <label for="">Placa</label>
                    <input
                      type="text"
                      class="form-control"
                      disabled
                      value={customer.idCard}
                    />
                  </div>
                </div>
                <div class="col-xl-3 col-lg-3 col-md-3 col-sm-2 col-6">
                  <div class="form-group">
                    <label for="">Marca</label>
                    <input
                      type="text"
                      class="form-control"
                      disabled
                      value={customer.businessName}
                    />
                  </div>
                </div>
                <div class="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-6">
                  <div class="form-group">
                    <label for="">Modelo</label>
                    <input
                      type="text"
                      class="form-control"
                      disabled
                      value={customer.email}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </md-card-content>
</md-card>
