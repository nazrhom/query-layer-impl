
## Utxos

### Asset

Get all UTxOs that contain some of the specified asset

[Link to OpenApi endpoint](https://nazrhom.github.io/query-layer-impl/index.html#/default/get_utxos_asset)

#### Request

Schema:


<details>
<summary>Show Example: </summary>

```
{
  "asset_name": "333333333333",
  "minting_policy_hash": "33333333333333333333333333333333333333333333333333333333"
}
```
</details>

#### Response

Schema:


<details>
<summary>Show Example: </summary>

```
{
  "utxos": [
    {
      "input": {
        "transaction_id": "3333333333333333333333333333333333333333333333333333333333333333",
        "index": 858993459
      },
      "output": {
        "address": "stake177stake177",
        "amount": {
          "coin": "0000000000"
        },
        "script_ref": {
          "tag": "plutus_script",
          "value": {
            "language": "plutus_v1/plutus_v1",
            "bytes": "333333333333"
          }
        }
      }
    }
  ]
}
```
</details>

### Transaction Hash

Get all UTxOs produced by the transaction [These are only outputs, should they be in/outs??]

[Link to OpenApi endpoint](https://nazrhom.github.io/query-layer-impl/index.html#/default/get_utxos_transaction_hash)

#### Request

Schema:


<details>
<summary>Show Example: </summary>

```
"3333333333333333333333333333333333333333333333333333333333333333"
```
</details>

#### Response

Schema:


<details>
<summary>Show Example: </summary>

```
{
  "utxos": [
    {
      "input": {
        "transaction_id": "3333333333333333333333333333333333333333333333333333333333333333",
        "index": 858993459
      },
      "output": {
        "address": "stake177stake177",
        "amount": {
          "coin": "0000000000"
        },
        "script_ref": {
          "tag": "plutus_script",
          "value": {
            "language": "plutus_v1/plutus_v1",
            "bytes": "333333333333"
          }
        }
      }
    }
  ]
}
```
</details>

### Address

Get all UTxOs present at the address

[Link to OpenApi endpoint](https://nazrhom.github.io/query-layer-impl/index.html#/default/get_utxos_address)

#### Request

Schema:


<details>
<summary>Show Example: </summary>

```
"stake177stake177"
```
</details>

#### Response

Schema:


<details>
<summary>Show Example: </summary>

```
{
  "utxos": [
    {
      "input": {
        "transaction_id": "3333333333333333333333333333333333333333333333333333333333333333",
        "index": 858993459
      },
      "output": {
        "address": "stake177stake177",
        "amount": {
          "coin": "0000000000"
        },
        "script_ref": {
          "tag": "plutus_script",
          "value": {
            "language": "plutus_v1/plutus_v1",
            "bytes": "333333333333"
          }
        }
      }
    }
  ]
}
```
</details>

### Payment Credential

Get all UTxOs present at the addresses which use the payment credential

[Link to OpenApi endpoint](https://nazrhom.github.io/query-layer-impl/index.html#/default/get_utxos_payment_credential)

#### Request

Schema:


<details>
<summary>Show Example: </summary>

```
{
  "tag": "pubkey_hash",
  "value": "33333333333333333333333333333333333333333333333333333333"
}
```
</details>

#### Response

Schema:


<details>
<summary>Show Example: </summary>

```
{
  "utxos": [
    {
      "input": {
        "transaction_id": "3333333333333333333333333333333333333333333333333333333333333333",
        "index": 858993459
      },
      "output": {
        "address": "stake177stake177",
        "amount": {
          "coin": "0000000000"
        },
        "script_ref": {
          "tag": "plutus_script",
          "value": {
            "language": "plutus_v1/plutus_v1",
            "bytes": "333333333333"
          }
        }
      }
    }
  ]
}
```
</details>

### Stake Credential

Get all UTxOs present at the addresses which use the stake credential

[Link to OpenApi endpoint](https://nazrhom.github.io/query-layer-impl/index.html#/default/get_utxos_stake_credential)

#### Request

Schema:


<details>
<summary>Show Example: </summary>

```
"stake177stake177"
```
</details>

#### Response

Schema:


<details>
<summary>Show Example: </summary>

```
{
  "utxos": [
    {
      "input": {
        "transaction_id": "3333333333333333333333333333333333333333333333333333333333333333",
        "index": 858993459
      },
      "output": {
        "address": "stake177stake177",
        "amount": {
          "coin": "0000000000"
        },
        "script_ref": {
          "tag": "plutus_script",
          "value": {
            "language": "plutus_v1/plutus_v1",
            "bytes": "333333333333"
          }
        }
      }
    }
  ]
}
```
</details>

## Block

### Number

Get the block with the supplied block number

[Link to OpenApi endpoint](https://nazrhom.github.io/query-layer-impl/index.html#/default/get_block_number)

#### Request

Schema:


<details>
<summary>Show Example: </summary>

```
{
  "block_number": "0000000000"
}
```
</details>

#### Response

Schema:


<details>
<summary>Show Example: </summary>

```
{
  "block": {
    "auxiliary_data_set": {},
    "header": {
      "body_signature": "33333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333",
      "header_body": {
        "block_number": 858993459,
        "slot": "0000000000",
        "prev_hash": "3333333333333333333333333333333333333333333333333333333333333333",
        "issuer_vkey": "3333333333333333333333333333333333333333333333333333333333333333",
        "vrf_vkey": "3333333333333333333333333333333333333333333333333333333333333333",
        "vrf_result": {
          "output": "333333333333",
          "proof": "333333333333"
        },
        "block_body_size": 858993459,
        "block_body_hash": "3333333333333333333333333333333333333333333333333333333333333333",
        "operational_cert": {
          "hot_vkey": "3333333333333333333333333333333333333333333333333333333333333333",
          "kes_period": 858993459,
          "sequence_number": 858993459,
          "sigma": "33333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333"
        },
        "protocol_version": {
          "major": 858993459,
          "minor": 858993459
        }
      }
    },
    "invalid_transactions": [
      858993459
    ],
    "transaction_bodies": [
      {
        "auxiliary_data_hash": "3333333333333333333333333333333333333333333333333333333333333333",
        "inputs": [
          {
            "transaction_id": "3333333333333333333333333333333333333333333333333333333333333333",
            "index": 858993459
          }
        ],
        "outputs": [
          {
            "address": "stake177stake177",
            "amount": {
              "coin": "0000000000"
            },
            "script_ref": {
              "tag": "plutus_script",
              "value": {
                "language": "plutus_v1/plutus_v1",
                "bytes": "333333333333"
              }
            }
          }
        ],
        "fee": "0000000000",
        "mint": [
          {
            "script_hash": "33333333333333333333333333333333333333333333333333333333",
            "assets": [
              {
                "asset_name": "333333333333",
                "amount": "222222222222"
              }
            ]
          }
        ],
        "total_collateral": "0000000000",
        "voting_procedures": [
          {
            "key": {
              "tag": "cc_credential",
              "credential": {
                "tag": "pubkey_hash",
                "value": "33333333333333333333333333333333333333333333333333333333"
              }
            },
            "value": [
              {
                "key": {
                  "transaction_id": "3333333333333333333333333333333333333333333333333333333333333333",
                  "gov_action_index": "0000000000"
                },
                "value": {
                  "vote": "yes/yes/yes/yes"
                }
              }
            ]
          }
        ]
      }
    ],
    "transaction_witness_sets": [
      {
        "Utc": -60000000,
        "redeemers": [
          {
            "data": {
              "Utc": -60000000,
              "alternative": "0000000000"
            },
            "tag": "mint/mint/mint/mint",
            "index": "0000000000",
            "ex_units": {
              "mem": "0000000000",
              "steps": "0000000000"
            }
          }
        ]
      }
    ]
  }
}
```
</details>

### Hash

Get the block with the supplied block hash

[Link to OpenApi endpoint](https://nazrhom.github.io/query-layer-impl/index.html#/default/get_block_hash)

#### Request

Schema:


<details>
<summary>Show Example: </summary>

```
"3333333333333333333333333333333333333333333333333333333333333333"
```
</details>

#### Response

Schema:


<details>
<summary>Show Example: </summary>

```
{
  "block": {
    "auxiliary_data_set": {},
    "header": {
      "body_signature": "33333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333",
      "header_body": {
        "block_number": 858993459,
        "slot": "0000000000",
        "prev_hash": "3333333333333333333333333333333333333333333333333333333333333333",
        "issuer_vkey": "3333333333333333333333333333333333333333333333333333333333333333",
        "vrf_vkey": "3333333333333333333333333333333333333333333333333333333333333333",
        "vrf_result": {
          "output": "333333333333",
          "proof": "333333333333"
        },
        "block_body_size": 858993459,
        "block_body_hash": "3333333333333333333333333333333333333333333333333333333333333333",
        "operational_cert": {
          "hot_vkey": "3333333333333333333333333333333333333333333333333333333333333333",
          "kes_period": 858993459,
          "sequence_number": 858993459,
          "sigma": "33333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333"
        },
        "protocol_version": {
          "major": 858993459,
          "minor": 858993459
        }
      }
    },
    "invalid_transactions": [
      858993459
    ],
    "transaction_bodies": [
      {
        "auxiliary_data_hash": "3333333333333333333333333333333333333333333333333333333333333333",
        "inputs": [
          {
            "transaction_id": "3333333333333333333333333333333333333333333333333333333333333333",
            "index": 858993459
          }
        ],
        "outputs": [
          {
            "address": "stake177stake177",
            "amount": {
              "coin": "0000000000"
            },
            "script_ref": {
              "tag": "plutus_script",
              "value": {
                "language": "plutus_v1/plutus_v1",
                "bytes": "333333333333"
              }
            }
          }
        ],
        "fee": "0000000000",
        "mint": [
          {
            "script_hash": "33333333333333333333333333333333333333333333333333333333",
            "assets": [
              {
                "asset_name": "333333333333",
                "amount": "222222222222"
              }
            ]
          }
        ],
        "total_collateral": "0000000000",
        "voting_procedures": [
          {
            "key": {
              "tag": "cc_credential",
              "credential": {
                "tag": "pubkey_hash",
                "value": "33333333333333333333333333333333333333333333333333333333"
              }
            },
            "value": [
              {
                "key": {
                  "transaction_id": "3333333333333333333333333333333333333333333333333333333333333333",
                  "gov_action_index": "0000000000"
                },
                "value": {
                  "vote": "yes/yes/yes/yes"
                }
              }
            ]
          }
        ]
      }
    ],
    "transaction_witness_sets": [
      {
        "Utc": -60000000,
        "redeemers": [
          {
            "data": {
              "Utc": -60000000,
              "alternative": "0000000000"
            },
            "tag": "mint/mint/mint/mint",
            "index": "0000000000",
            "ex_units": {
              "mem": "0000000000",
              "steps": "0000000000"
            }
          }
        ]
      }
    ]
  }
}
```
</details>

## Transaction

### Hash

Get the transaction with the supplied transaction hash

[Link to OpenApi endpoint](https://nazrhom.github.io/query-layer-impl/index.html#/default/get_transaction_hash)

#### Request

Schema:


<details>
<summary>Show Example: </summary>

```
"3333333333333333333333333333333333333333333333333333333333333333"
```
</details>

#### Response

Schema:


<details>
<summary>Show Example: </summary>

```
{
  "auxiliary_data": {},
  "body": {
    "auxiliary_data_hash": "3333333333333333333333333333333333333333333333333333333333333333",
    "inputs": [
      {
        "transaction_id": "3333333333333333333333333333333333333333333333333333333333333333",
        "index": 858993459
      }
    ],
    "outputs": [
      {
        "address": "stake177stake177",
        "amount": {
          "coin": "0000000000"
        },
        "script_ref": {
          "tag": "plutus_script",
          "value": {
            "language": "plutus_v1/plutus_v1",
            "bytes": "333333333333"
          }
        }
      }
    ],
    "fee": "0000000000",
    "mint": [
      {
        "script_hash": "33333333333333333333333333333333333333333333333333333333",
        "assets": [
          {
            "asset_name": "333333333333",
            "amount": "222222222222"
          }
        ]
      }
    ],
    "total_collateral": "0000000000",
    "voting_procedures": [
      {
        "key": {
          "tag": "cc_credential",
          "credential": {
            "tag": "pubkey_hash",
            "value": "33333333333333333333333333333333333333333333333333333333"
          }
        },
        "value": [
          {
            "key": {
              "transaction_id": "3333333333333333333333333333333333333333333333333333333333333333",
              "gov_action_index": "0000000000"
            },
            "value": {
              "vote": "yes/yes/yes/yes"
            }
          }
        ]
      }
    ]
  },
  "is_valid": false,
  "witness_set": {
    "Utc": -60000000,
    "redeemers": [
      {
        "data": {
          "Utc": -60000000,
          "alternative": "0000000000"
        },
        "tag": "mint/mint/mint/mint",
        "index": "0000000000",
        "ex_units": {
          "mem": "0000000000",
          "steps": "0000000000"
        }
      }
    ]
  }
}
```
</details>

### Submit

Submit a signed transaction to the cardano node.

[Link to OpenApi endpoint](https://nazrhom.github.io/query-layer-impl/index.html#/default/get_transaction_submit)

#### Request

Schema:


<details>
<summary>Show Example: </summary>

```
{
  "auxiliary_data": {},
  "body": {
    "auxiliary_data_hash": "3333333333333333333333333333333333333333333333333333333333333333",
    "inputs": [
      {
        "transaction_id": "3333333333333333333333333333333333333333333333333333333333333333",
        "index": 858993459
      }
    ],
    "outputs": [
      {
        "address": "stake177stake177",
        "amount": {
          "coin": "0000000000"
        },
        "script_ref": {
          "tag": "plutus_script",
          "value": {
            "language": "plutus_v1/plutus_v1",
            "bytes": "333333333333"
          }
        }
      }
    ],
    "fee": "0000000000",
    "mint": [
      {
        "script_hash": "33333333333333333333333333333333333333333333333333333333",
        "assets": [
          {
            "asset_name": "333333333333",
            "amount": "222222222222"
          }
        ]
      }
    ],
    "total_collateral": "0000000000",
    "voting_procedures": [
      {
        "key": {
          "tag": "cc_credential",
          "credential": {
            "tag": "pubkey_hash",
            "value": "33333333333333333333333333333333333333333333333333333333"
          }
        },
        "value": [
          {
            "key": {
              "transaction_id": "3333333333333333333333333333333333333333333333333333333333333333",
              "gov_action_index": "0000000000"
            },
            "value": {
              "vote": "yes/yes/yes/yes"
            }
          }
        ]
      }
    ]
  },
  "is_valid": false,
  "witness_set": {
    "Utc": -60000000,
    "redeemers": [
      {
        "data": {
          "Utc": -60000000,
          "alternative": "0000000000"
        },
        "tag": "mint/mint/mint/mint",
        "index": "0000000000",
        "ex_units": {
          "mem": "0000000000",
          "steps": "0000000000"
        }
      }
    ]
  }
}
```
</details>

## Transactions

### Block Number

Get all transactions contained in the block with the supplied block number []

[Link to OpenApi endpoint](https://nazrhom.github.io/query-layer-impl/index.html#/default/get_transactions_block_number)

#### Request

Schema:


<details>
<summary>Show Example: </summary>

```
{
  "block_number": "0000000000"
}
```
</details>

#### Response

Schema:


<details>
<summary>Show Example: </summary>

```
{
  "transactions": [
    {
      "body": {
        "auxiliary_data_hash": "3333333333333333333333333333333333333333333333333333333333333333",
        "inputs": [
          {
            "transaction_id": "3333333333333333333333333333333333333333333333333333333333333333",
            "index": 858993459
          }
        ],
        "outputs": [
          {
            "address": "stake177stake177",
            "amount": {
              "coin": "0000000000"
            },
            "script_ref": {
              "tag": "plutus_script",
              "value": {
                "language": "plutus_v1/plutus_v1",
                "bytes": "333333333333"
              }
            }
          }
        ],
        "fee": "0000000000",
        "mint": [
          {
            "script_hash": "33333333333333333333333333333333333333333333333333333333",
            "assets": [
              {
                "asset_name": "333333333333",
                "amount": "222222222222"
              }
            ]
          }
        ],
        "total_collateral": "0000000000",
        "voting_procedures": [
          {
            "key": {
              "tag": "cc_credential",
              "credential": {
                "tag": "pubkey_hash",
                "value": "33333333333333333333333333333333333333333333333333333333"
              }
            },
            "value": [
              {
                "key": {
                  "transaction_id": "3333333333333333333333333333333333333333333333333333333333333333",
                  "gov_action_index": "0000000000"
                },
                "value": {
                  "vote": "yes/yes/yes/yes"
                }
              }
            ]
          }
        ]
      },
      "is_valid": false,
      "witness_set": {
        "Utc": -60000000,
        "redeemers": [
          {
            "data": {
              "Utc": -60000000,
              "alternative": "0000000000"
            },
            "tag": "mint/mint/mint/mint",
            "index": "0000000000",
            "ex_units": {
              "mem": "0000000000",
              "steps": "0000000000"
            }
          }
        ]
      }
    }
  ]
}
```
</details>

### Block Hash

Get all transactions contained in the block with the supplied block hash

[Link to OpenApi endpoint](https://nazrhom.github.io/query-layer-impl/index.html#/default/get_transactions_block_hash)

#### Request

Schema:


<details>
<summary>Show Example: </summary>

```
"3333333333333333333333333333333333333333333333333333333333333333"
```
</details>

#### Response

Schema:


<details>
<summary>Show Example: </summary>

```
{
  "transactions": [
    {
      "body": {
        "auxiliary_data_hash": "3333333333333333333333333333333333333333333333333333333333333333",
        "inputs": [
          {
            "transaction_id": "3333333333333333333333333333333333333333333333333333333333333333",
            "index": 858993459
          }
        ],
        "outputs": [
          {
            "address": "stake177stake177",
            "amount": {
              "coin": "0000000000"
            },
            "script_ref": {
              "tag": "plutus_script",
              "value": {
                "language": "plutus_v1/plutus_v1",
                "bytes": "333333333333"
              }
            }
          }
        ],
        "fee": "0000000000",
        "mint": [
          {
            "script_hash": "33333333333333333333333333333333333333333333333333333333",
            "assets": [
              {
                "asset_name": "333333333333",
                "amount": "222222222222"
              }
            ]
          }
        ],
        "total_collateral": "0000000000",
        "voting_procedures": [
          {
            "key": {
              "tag": "cc_credential",
              "credential": {
                "tag": "pubkey_hash",
                "value": "33333333333333333333333333333333333333333333333333333333"
              }
            },
            "value": [
              {
                "key": {
                  "transaction_id": "3333333333333333333333333333333333333333333333333333333333333333",
                  "gov_action_index": "0000000000"
                },
                "value": {
                  "vote": "yes/yes/yes/yes"
                }
              }
            ]
          }
        ]
      },
      "is_valid": false,
      "witness_set": {
        "Utc": -60000000,
        "redeemers": [
          {
            "data": {
              "Utc": -60000000,
              "alternative": "0000000000"
            },
            "tag": "mint/mint/mint/mint",
            "index": "0000000000",
            "ex_units": {
              "mem": "0000000000",
              "steps": "0000000000"
            }
          }
        ]
      }
    }
  ]
}
```
</details>

## Datum

### Hash

Get the datum that hashes to the supplied data hash

[Link to OpenApi endpoint](https://nazrhom.github.io/query-layer-impl/index.html#/default/get_datum_hash)

#### Request

Schema:


<details>
<summary>Show Example: </summary>

```
"3333333333333333333333333333333333333333333333333333333333333333"
```
</details>

#### Response

Schema:


<details>
<summary>Show Example: </summary>

```
{
  "datum": {
    "Utc": -60000000,
    "alternative": "0000000000"
  }
}
```
</details>

## Plutus Script

### Hash

Get the plutus script that hashes to the supplied script hash

[Link to OpenApi endpoint](https://nazrhom.github.io/query-layer-impl/index.html#/default/get_plutus_script_hash)

#### Request

Schema:


<details>
<summary>Show Example: </summary>

```
"33333333333333333333333333333333333333333333333333333333"
```
</details>

#### Response

Schema:


<details>
<summary>Show Example: </summary>

```
{
  "plutus_script": {
    "language": "plutus_v1/plutus_v1",
    "bytes": "333333333333"
  }
}
```
</details>

## Native Script

### Hash

Get the native script that hashes to the supplied script hash

[Link to OpenApi endpoint](https://nazrhom.github.io/query-layer-impl/index.html#/default/get_native_script_hash)

#### Request

Schema:


<details>
<summary>Show Example: </summary>

```
"33333333333333333333333333333333333333333333333333333333"
```
</details>

#### Response

Schema:


<details>
<summary>Show Example: </summary>

```
{
  "native_script": {
    "tag": "all/all/all/all",
    "scripts": [
      {
        "tag": "all/all/all/all",
        "scripts": [
          {
            "tag": "all/all/all/all",
            "scripts": [
              {
                "tag": "all/all/all/all",
                "scripts": []
              }
            ]
          }
        ]
      }
    ]
  }
}
```
</details>

## Metadata

### Transaction Hash

Get the metadata present on the transaction with the supplied transaction hash

[Link to OpenApi endpoint](https://nazrhom.github.io/query-layer-impl/index.html#/default/get_metadata_transaction_hash)

#### Request

Schema:


<details>
<summary>Show Example: </summary>

```
"3333333333333333333333333333333333333333333333333333333333333333"
```
</details>

#### Response

Schema:


<details>
<summary>Show Example: </summary>

```
{
  "tag": "map",
  "contents": [
    {
      "key": {
        "tag": "list",
        "contents": [
          {
            "tag": "list",
            "contents": [
              {
                "tag": "list",
                "contents": []
              }
            ]
          }
        ]
      },
      "value": {
        "tag": "list",
        "contents": [
          {
            "tag": "list",
            "contents": [
              {
                "tag": "list",
                "contents": []
              }
            ]
          }
        ]
      }
    }
  ]
}
```
</details>

## Protocol Parameters

### Latest

Get the latest protocol parameters

[Link to OpenApi endpoint](https://nazrhom.github.io/query-layer-impl/index.html#/default/get_protocol_parameters_latest)

#### Response

Schema:


<details>
<summary>Show Example: </summary>

```
{
  "ada_per_utxo_byte": "0000000000",
  "max_block_header_size": 858993459,
  "max_value_size": 858993459,
  "pool_deposit": "0000000000",
  "drep_voting_thresholds": [],
  "drep_deposit": "0000000000"
}
```
</details>

### Epoch

Get the protocol parameters at the supplied epoch number

[Link to OpenApi endpoint](https://nazrhom.github.io/query-layer-impl/index.html#/default/get_protocol_parameters_epoch)

#### Request

Schema:


<details>
<summary>Show Example: </summary>

```
{
  "epoch_number": 858993459
}
```
</details>

#### Response

Schema:


<details>
<summary>Show Example: </summary>

```
{
  "ada_per_utxo_byte": "0000000000",
  "max_block_header_size": 858993459,
  "max_value_size": 858993459,
  "pool_deposit": "0000000000",
  "drep_voting_thresholds": [],
  "drep_deposit": "0000000000"
}
```
</details>
