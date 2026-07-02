package com.inventory.system.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.inventory.system.entity.Product;
import com.inventory.system.entity.StockTransaction;
import com.inventory.system.repository.ProductRepository;
import com.inventory.system.repository.StockTransactionRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/stock")
@CrossOrigin(origins = "http://localhost:5173", methods = {
                RequestMethod.GET,
                RequestMethod.POST,
                RequestMethod.PUT,
                RequestMethod.DELETE,
                RequestMethod.OPTIONS
})
public class StockController {

        private final ProductRepository productRepository;
        private final StockTransactionRepository stockRepository;

        public StockController(
                        ProductRepository productRepository,
                        StockTransactionRepository stockRepository) {

                this.productRepository = productRepository;
                this.stockRepository = stockRepository;
        }

        @PostMapping("/{productId}/in")
        public StockTransaction stockIn(
                        @PathVariable Long productId,
                        @RequestParam int quantity) {

                Product product = productRepository.findById(productId)
                                .orElseThrow(() -> new RuntimeException(
                                                "Product not found: " + productId));

                product.setQuantity(
                                product.getQuantity() + quantity);

                productRepository.save(product);

                StockTransaction transaction = new StockTransaction();

                transaction.setProduct(product);
                transaction.setType("IN");
                transaction.setQuantity(quantity);
                transaction.setCreatedAt(LocalDateTime.now());

                return stockRepository.save(transaction);
        }

        @PostMapping("/{productId}/out")
        public StockTransaction stockOut(
                        @PathVariable Long productId,
                        @RequestParam int quantity) {

                Product product = productRepository.findById(productId)
                                .orElseThrow(() -> new RuntimeException(
                                                "Product not found: " + productId));

                if (product.getQuantity() < quantity) {
                        throw new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST,
                                        "Not enough stock");
                }

                product.setQuantity(
                                product.getQuantity() - quantity);

                productRepository.save(product);

                StockTransaction transaction = new StockTransaction();

                transaction.setProduct(product);
                transaction.setType("OUT");
                transaction.setQuantity(quantity);
                transaction.setCreatedAt(LocalDateTime.now());

                return stockRepository.save(transaction);
        }

        @GetMapping
        public List<StockTransaction> getTransactions() {

                return stockRepository.findAll();
        }

        @GetMapping("/product/{productId}")
        public List<StockTransaction> getProductHistory(
                        @PathVariable Long productId) {

                return stockRepository.findByProductId(productId);
        }
}