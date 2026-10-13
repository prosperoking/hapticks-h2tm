<template>
     <div class="container mx-auto" ref="">
    <div class="flex justify-center w-3/5 mx-auto">
        <div class="px-2 py-5 bg-white col-md-3 col-7 border-dark" id="receipt">
            <div class="flex flex-col mb-0">
                <div class="w-1/3 mx-auto col-5">

                </div>
                <div class="mb-1 col-12">
                    <p class="mb-0 text-xl font-medium text-center">**** Merchant Copy ****</p>
                </div>
            </div>
            <div class="px-3 space-y-4 divide-y divide-gray-500 row">
                <div class="col-12">
                    <small>Merchant Name:</small> {{ data.merchantName }}<br />
                    <small>Location:</small> {{ data.merchantAddress }}<br />
                    <small>TERMINAL ID:</small> {{ data.terminalId }}
                </div>
                <div class="col-12 border-bottom">
                    <p class="text-xl font-bold text-center">
                        PURCHASE
                    </p>
                    <span>STAN:</span> {{ data.STAN }} <br />
                    <span>DATE/TIME:</span> {{ data.transactionTime }}
                </div>
                <div class="col-12 border-bottom">
                    <div class="flex justify-between">
                        <div class="w-2/6">
                            <strong>Amount</strong>
                        </div>
                        <div class="w-3/6 text-right">
                            <strong>NGN {{ data.amount }}</strong>
                        </div>
                    </div>
                </div>
                <div class="col-12">
                    <p class="mb-0">
                       {{ data.issuer }}
                    </p>
                    <p class="text-center h3"><b>{{ data.PAN }}</b></p>
                    {''} <br />
                    EXPIRY DATE: {{ data.cardExpiration }} <br />
                    AUTHORISATION CODE:
                </div>
                <div class="px-0 col-12">
                    <p class="mt-2 text-xl font-bold text-center text-uppercase">
                        {{ data.responseDescription }}
                    </p>
                </div>
                <div class="col-12">
                    STATUS CODE: {{ data.responseCode }} <br />
                    AID: <br />
                    RRN: {{ data.rrn }}
                </div>
            </div>
        </div>
    </div>
    <div class="row justify-content-center">
        <div class="col-4">
            <button class="px-3 py-2 text-white bg-gray-500 rounded hover:bg-gray -600" @click={print} >Print</button>
        </div>
    </div>
</div>
</template>

<script setup lang="ts">
import { Transaction } from '../@types/types';

defineProps<{
    data: Transaction;
}>();
const print = () => {
    const printContents = document.getElementById('receipt')?.innerHTML;
    const originalContents = document.body.innerHTML;

    if (printContents) {
        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
    }
};
</script>