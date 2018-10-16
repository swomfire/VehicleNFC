package com.swomfire.vehicleNFCUser;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;

import java.util.ArrayList;
import java.util.List;

import Util.RmaAPIUtils;
import model.Order;
import remote.RmaAPIService;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import service.DBHelper;
import sqliteModel.History;
import sqliteModel.HistoryDetail;

public class HistoryActivity extends Activity {
    private Context context;
    TextView txtPos;
    List<History> historyList = new ArrayList<History>();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_history);
        context = this;
        loadOrderByUserId();
    }

    public void loadOrderByUserId(){
        RmaAPIService mService = RmaAPIUtils.getAPIService();
        mService.getOrderByUserId(Integer.parseInt("1")).enqueue(new Callback<List<Order>>() {
            @Override
            public void onResponse(Call<List<Order>> call, Response<List<Order>> response) {
                if (response.isSuccessful()) {
                    List<Order> resultList = response.body();
                    if (resultList != null) {
                        DBHelper db = new DBHelper(context);
                        db.deleteAllContact();
                        for(Order order : resultList) {
                            db.insertOrder(order);
                        }

                        List<History> histories = db.getAllOrder();
                    }
                }
            }

            @Override
            public void onFailure(Call<List<Order>> call, Throwable t) {
                Toast toast = Toast.makeText(getApplicationContext(), t.getMessage(), Toast.LENGTH_SHORT);
                toast.show();
            }
        });
    }


    public void onClickCard(View view) {

        //Intent i = new Intent(context, HistoryDetail.class);
        //startActivity(i);

//        txtPos = findViewById(R.id.txtPos);
        int i = Integer.parseInt((String)txtPos.getText());

        Intent newActivity1 = new Intent(context, HistoryDetail.class);
        newActivity1.putExtra("hisItem", historyList.get(i));
        startActivity(newActivity1);

    }
}
