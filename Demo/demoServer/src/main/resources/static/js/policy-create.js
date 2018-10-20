var pricingJson = [];
var tabs = "";
$(document).ready(function () {
    // addPricing();
    submitPricing();
    // submitPricing();
    loadVehicleTypes();
    var url = location.href;
    console.log("URL: " + url);
    var index = url.lastIndexOf("=");
    var params = url.slice(index, url.length);
    console.log("params: " + params);

    var locationId = url.slice(index + 1, index + 2);
    console.log("locationid: " + locationId);
    loadLocation(locationId);
    $('.clockpickerFrom').clockpicker({
        placement: 'bottom',
        align: 'left',
        donetext: 'Done',
        afterDone: function () {
            console.log("after done");
            parseTimeToLong("clockpickerFrom", "ParkingFrom");
        }
    });
    $('.clockpickerTo').clockpicker({
        placement: 'bottom',
        align: 'left',
        donetext: 'Done',
        afterDone: function () {
            console.log("after done");
            parseTimeToLong("clockpickerTo", "ParkingTo");
        }
    });
    savePolicyVehicle(locationId);
});

function loadLocation(locationId) {
    $.ajax({
        type: "GET",
        dataType: "json",
        url: "http://localhost:8080/location/get/" + locationId,
        success: function (data) {
            console.log("Locaiton: " + data);
            $('#location').val(data.location);
            $('#locationId').val(data.id);
            if (data.isActivated === true) {
                $('#status').val("Active");
            } else {
                $('#status').val("De-active");
            }
        }, error: function () {
            console.log("Failed to load Location");
        }
    });
}

function savePolicyVehicle(locationId) {
    $('#save-policy-vehicle').on('click', function () {
        var vehicleTypeArr = [];
        var vehicleTypes = $('input[name=chk]:checked').map(function (i) {
            var vehicleType = {
                id: this.value,
                name: $(this).next('label').text()
            }
            vehicleTypeArr.push(vehicleType);
            return this;
        }).get();
        var policyJson = {
            allowedParkingFrom: $('#allowedParkingFrom').val(),
            allowedParkingTo: $('#allowedParkingTo').val()
        }
        var json = {
            locationId: locationId,
            policy: policyJson,
            vehicleTypes: vehicleTypeArr
        }
        $.ajax({
            type: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(json),
            url: 'http://localhost:8080/policy/create',
            success: function (data) {
                console.log("Save successfully");
                console.log(data);
                createPricingTabs(data.id);
            }, error: function (data) {
                console.log("Could not save policy vehicle")
            }
        });
    });
}

function createPricingTabs(policyId) {
    $.ajax({
        type: "GET",
        dataType: "json",
        url: 'http://localhost:8080/policy-vehicleType/get-by-policy?policyId=' + policyId,
        success: function (data) {
            var navTabs = '<ul class="nav nav-tabs">';
            var tabPanes = '<div class="tab-content">'
            for (i = 0; i < data.length; i++) {
                // navTabs += '<li class="nav-item">' +
                //     '<a class="nav-link active" data-toggle="tab" href="#vehicle-' + data[i].vehicleTypeId.id + '">' + data[i].vehicleTypeId.name + '</a>' +
                //             '</li>';
                if (i == 0){
                    navTabs += '<li class="nav-item">' +
                        '<a class="nav-link active" data-toggle="tab" href="#vehicle-' + data[i].vehicleTypeId.id + '">' + data[i].vehicleTypeId.name + '</a>' +
                        '</li>';
                    tabPanes += ' <div class="tab-pane container active" id="vehicle-' + data[i].vehicleTypeId.id + '"></div>';
                } else {
                    navTabs += '<li class="nav-item">' +
                        '<a class="nav-link" data-toggle="tab" href="#vehicle-' + data[i].vehicleTypeId.id + '">' + data[i].vehicleTypeId.name + '</a>' +
                        '</li>';
                    tabPanes += ' <div class="tab-pane container" id="vehicle-' + data[i].vehicleTypeId.id + '"></div>';
                }

            }
            navTabs += '</ul>';
            $('.pricing-container').append(navTabs);
            tabs += navTabs;
            tabPanes += '</div>';
            tabs += tabPanes;
            $('.pricing-container').append(tabPanes);
            var tables = "";
            for (let i = 0; i <data.length; i++) {
                tables += createTable(data[i].vehicleTypeId.id, data[i].id);
            }
            tabs += tables;
        }, error: function (data) {
            console.log("Failed to get policy vehicle types");
        }
    });
}
function createTable(vehicleTypeId, policyHasVehicleTypeId) {
    var btnAddPricing = '<button class="btn btn-primary" type="button" value="Add Pricing" onclick="addPricing('+ policyHasVehicleTypeId +', ' + vehicleTypeId + ')" id="btn-add-pricing">Add Pricing\n' +
        '                                </button>';
    var table =  ' <table class="table table-hover" id="pricing-vehicle-'+vehicleTypeId+'">\n' +
        '                                    <thead>\n' +
        '                                    <tr>\n' +
        '                                        <th>From Hour:</th>\n' +
        '                                        <th>Price Per Hour</th>\n' +
        '                                        <th>Late Fee Per Hour</th>\n' +
        '                                    </tr>\n' +
        '                                    </thead>\n' +
        '                                    <tbody>\n' +
        '\n' +
        '                                    </tbody>\n' +
        '                                </table>';

    var tableData = btnAddPricing + table;
    $('#vehicle-'+vehicleTypeId).append(btnAddPricing);
    $('#vehicle-'+vehicleTypeId).append(table);
    return table;
}
function loadVehicleTypes() {
    $.ajax({
        type: "GET",
        dataType: "json",
        url: 'http://localhost:8080/vehicleType/get-all',
        success: function (data) {
            console.log("VehicleTypes: " + data);
            for (i = 0; i < data.length; i++) {
                var chk = '<input type="checkbox" name="chk" id="vehicleType-' + i + '" value="' + data[i].id + '"><label>' + data[i].name + '</label>';
                $('#vehicleTypeArr').append(chk);
            }
        }, error: function (data) {
            console.log("Could not load vehicle types")
        }
    });
}

function loadPricingModal(policyHasVehicleType, pricingId) {
    console.log("PricingId: "+pricingId);
    $.ajax({
        type: "GET",
        dataType: "json",
        url: 'http://localhost:8080/pricing/get/'+pricingId,
        success: function (data) {
            $('#updatePricingModal #policyHasTblVehicleTypeId').val(policyHasVehicleType);
            $('#updatePricingModal #pricingId').val(pricingId);
            $('#updatePricingModal #fromHour').val(data.fromHour);
            $('#updatePricingModal #pricePerHour').val(data.pricePerHour);
            $('#updatePricingModal #lateFeePerHour').val(data.lateFeePerHour);
            $('#updatePricingModal').modal();
        }, error: function () {

        }
    });
}

function savePricing(policyHasVehicleTypeId, vehicleTypeId, pricingId) {
    // $('#updatePricingModal').modal();
    loadPricingModal(policyHasVehicleTypeId, pricingId);
    $('#btn-save-pricing').off().click(function () {
        let times = 0;
        console.log("Times: "+(times++));
        let pricingObject ;
        console.log("PricingInfo: "+ pricingId+
            " | FromHour: "+$('#updatePricingModal #fromHour').val()+
            " | PricePerHour: "+$('#updatePricingModal #pricePerHour').val()+
            " | LateFeePerHour: "+ $('#updatePricingModal #lateFeePerHour').val()+
            " | PolicyHasVehicleType: "+policyHasVehicleTypeId);
         pricingObject =  {
            id: pricingId,
            fromHour: $('#updatePricingModal #fromHour').val(),
            pricePerHour: $('#updatePricingModal #pricePerHour').val(),
            lateFeePerHour: $('#updatePricingModal #lateFeePerHour').val(),
            policyHasTblVehicleTypeId: policyHasVehicleTypeId
        }

        pricingJson = JSON.parse(localStorage.getItem('pricingList-'+vehicleTypeId));
        $.ajax({
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            type: 'POST',
            url: 'http://localhost:8080/pricing/save-pricing-json',
            data: JSON.stringify(pricingObject),
            success: function (res) {
                console.log(res);
                console.log("Update Successfully");
                for (let i = 0; i < pricingJson.length; i++) {
                    if (pricingJson[i].id === pricingId) {
                        pricingJson[i] = res;
                    }
                }
                localStorage.setItem('pricingList-'+vehicleTypeId, JSON.stringify(pricingJson));
                $('#updatePricingModal').modal('hide');
                emptyTable(vehicleTypeId);
                loadPricingTable(vehicleTypeId);
            }, error: function (res) {
                console.log("Failed to save");
                console.log(res);
            }
        });
    });
}
function submitPricing() {

    var frm = $('#save-pricing');
    frm.submit(function (e) {
        var vehicleTypeId  = $('#save-pricing #vehicleTypeId').val();
        console.log("VehicleTypeId: "+vehicleTypeId);
        e.preventDefault();
        $.ajax({
            type: frm.attr('method'),
            url: frm.attr('action'),
            data: frm.serialize(),
            success: function (data) {
                console.log("Add Successfully");
                console.log(data);
                $('#savePricingModal').modal('hide');
                pricingJson.push(data);
                console.log("pricingJson: "+JSON.stringify(pricingJson))
                localStorage.setItem('pricingList-'+vehicleTypeId, JSON.stringify(pricingJson));
                emptyTable(vehicleTypeId);
                loadPricingTable(vehicleTypeId);
            }, error: function (data) {
                console.log("Failed to save");
                console.log(data);
            }
        });
    });
}
function addPricing(policyHasVehicleTypeId, vehicleTypeId) {

    $('#savePricingModal').modal();

    $('#save-pricing #policyHasTblVehicleTypeId').val(policyHasVehicleTypeId);
    $('#save-pricing #vehicleTypeId').val(vehicleTypeId);

}

function emptyTable(vehicleTypeId) {
    $('#pricing-vehicle-'+vehicleTypeId+' tbody').empty();
}
function loadPricingTable(vehicleTypeId) {
    let pricings = JSON.parse(localStorage.getItem('pricingList-'+vehicleTypeId));
    // console.log("Pricings: "+localStorage.getItem('pricingList-'+vehicleTypeId));
    let policyHasVehicleType =  $('#save-pricing #policyHasTblVehicleTypeId').val();
    console.log("loadingTable - policyHasVehicleType: "+policyHasVehicleType);
    // if (pricingJson.length > 0) {
        for (let i = 0; i < pricings.length; i++) {
            let row = '<tr>';
            row += '<td>' + pricings[i].fromHour + '</td>';
            row += '<td>' + pricings[i].pricePerHour + '</td>';
            row += '<td>' + pricings[i].lateFeePerHour + '</td>';
            // row += '<td><a href="#" onclick="loadPricingModal(' + policyHasVehicleType + ',' + pricings[i].id + ')" class="btn btn-primary saveBtn">Edit</a></td>'
            row += '<td><a href="#" onclick="savePricing(' + policyHasVehicleType + ',' + vehicleTypeId + ',' + pricings[i].id + ')" class="btn btn-primary saveBtn">Edit</a></td>'
            row += '<td><a href="#" onclick="deleteModal(' + pricings[i].id + ')" class="btn btn-danger delBtn">Delete</a></td>'
            row += '</tr>';
            $('#pricing-vehicle-'+vehicleTypeId +' tbody').append(row);
        }
}

function parseTimeToLong(clockPicker, type) {
    console.log(type);
    console.log("log: " + $('.clockpickerFrom #ParkingFrom').val());
    var time = $('.' + clockPicker + ' #' + type).val();
    console.log("Time: " + time);
    var temp = time.split(":")
    var hour = temp[0];
    console.log("hour: " + hour);
    var minute = temp[1];
    console.log("Minute: " + minute);
    console.log("hour ms: " + parseInt(hour * 3600000));
    console.log("minute ms: " + parseInt(minute * 60000));
    var ms = parseInt(hour * 3600000) + parseInt(minute * 60000);
    console.log(ms);
    $('#allowed' + type).val(ms);
}

