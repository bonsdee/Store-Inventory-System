package com.inventory.system.controller;

import com.inventory.system.entity.Product;
import com.inventory.system.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin("*")
public class NotificationController {

    private final ProductRepository productRepository;

    public NotificationController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @GetMapping
    public List<String> getNotifications() {

        List<String> notifications = new ArrayList<>();

        List<Product> products = productRepository.findAll();

        for (Product product : products) {

            if (product.getQuantity() == 0) {
                notifications.add("❌ " + product.getName() + " is out of stock.");
            } else if (product.getQuantity() <= 10) {
                notifications.add(
                    "⚠️ " + product.getName() +
                    " is low on stock (" +
                    product.getQuantity() +
                    " left)"
                );
            }
        }

        return notifications;
    }
}