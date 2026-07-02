package com.inventory.system.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import com.inventory.system.entity.Product;
import com.inventory.system.repository.ProductRepository;

@RestController
@RequestMapping("/api/products")
@CrossOrigin("*")
public class ProductController {

    private final ProductRepository repository;

    public ProductController(ProductRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Product> getProducts() {
        return repository.findAll();
    }

    @GetMapping("/barcode/{barcode}")
    public Product getProductByBarcode(@PathVariable String barcode) {

        return repository.findByBarcode(barcode)
                .orElseThrow(() -> new IllegalArgumentException("Product not found."));
    }

    @PostMapping
    public Product addProduct(@Valid @RequestBody Product product) {

        if (repository.existsByBarcode(product.getBarcode())) {
            throw new IllegalArgumentException("Barcode already exists.");
        }

        if (repository.existsByName(product.getName())) {
            throw new IllegalArgumentException("Product name already exists.");
        }

        return repository.save(product);
    }

    @PutMapping("/{id}")
    public Product updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody Product updatedProduct) {

        Product existingProduct = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found."));

        repository.findByBarcode(updatedProduct.getBarcode())
                .ifPresent(product -> {
                    if (!product.getId().equals(id)) {
                        throw new IllegalArgumentException("Barcode already exists.");
                    }
                });

        repository.findAll().stream()
                .filter(product -> product.getName().equalsIgnoreCase(updatedProduct.getName()))
                .findFirst()
                .ifPresent(product -> {
                    if (!product.getId().equals(id)) {
                        throw new IllegalArgumentException("Product name already exists.");
                    }
                });

        existingProduct.setBarcode(updatedProduct.getBarcode());
        existingProduct.setName(updatedProduct.getName());
        existingProduct.setPrice(updatedProduct.getPrice());
        existingProduct.setQuantity(updatedProduct.getQuantity());

        return repository.save(existingProduct);
    }

    @DeleteMapping("/{id}")
    public Map<String, String> deleteProduct(@PathVariable Long id) {

        Product product = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found."));

        repository.delete(product);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Product deleted successfully.");

        return response;
    }

    // Handles duplicate barcode, duplicate name, product not found
    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public Map<String, String> handleIllegalArgumentException(IllegalArgumentException ex) {

        Map<String, String> response = new HashMap<>();
        response.put("message", ex.getMessage());

        return response;
    }

    // Handles @Valid validation errors
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> handleValidationException(MethodArgumentNotValidException ex) {

        Map<String, String> response = new HashMap<>();

        String message = ex.getBindingResult()
                .getFieldErrors()
                .get(0)
                .getDefaultMessage();

        response.put("message", message);

        return response;
    }
}